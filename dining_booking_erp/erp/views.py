from collections import defaultdict
import uuid, datetime, pytz

# django DRF imports
from django.db import transaction
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView, ListCreateAPIView, RetrieveAPIView

# application imports
from .models import Table, Menu, OrderItem, Billing
from .serializers import TableSerializer, MenuSerializer, OrderItemSerializer, BillingSerializer

###### Table View ######
class TableInsert(CreateAPIView):
    queryset = Table.objects.all()
    serializer_class = TableSerializer

class TableList(ListAPIView):
    queryset = Table.objects.all()
    serializer_class = TableSerializer

class TableDelete(DestroyAPIView):
    queryset = Table.objects.filter(is_occupied=False)
    serializer_class = TableSerializer
    
class TableUpdate(UpdateAPIView):
    queryset = Table.objects.all()
    serializer_class = TableSerializer

###### Menu View ######
class ListMenu(ListAPIView):
    queryset = Menu.objects.all()
    serializer_class = MenuSerializer

class AddMenu(CreateAPIView):
    queryset = Menu.objects.all()
    serializer_class = MenuSerializer

class UpdateMenu(UpdateAPIView):
    queryset = Menu.objects.all()
    serializer_class = MenuSerializer

###### Order-Item View ######
class ListCreateOrder(ListCreateAPIView):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer

    def create(self, request):
        menu_data    = request.data.get('menu', [])
        table_id     = request.data.get('table_id', None)
        if not menu_data or not table_id: return Response({
            'message': 'Required parameter missing!'
        },status=status.HTTP_400_BAD_REQUEST)
        table_token  = uuid.uuid4()
        menu_hashmap = dict()
        with transaction.atomic():
            Table.objects.filter(id=table_id).update(table_token=table_token, is_occupied=True, start_at=datetime.datetime.now(pytz.utc))
            for item in menu_data:
                menu_id, qty = item.get('id', 0), item.get('qty', 0)
                key = f'{table_token}{menu_id}'
                if key in menu_hashmap:
                    menu_hashmap[key].qty += qty
                    continue
                menu_instance = Menu.objects.filter(id=menu_id).first()
                if menu_instance: 
                    menu_hashmap[key] = OrderItem(table_token=table_token, menu=menu_instance, qty=qty)
            OrderItem.objects.bulk_create(menu_hashmap.values())
        return Response({
            'message': 'Data created'
        },status=status.HTTP_201_CREATED)

    def list(self, request):
        ### Return all order's accoirding to the table-token ###
        hash_map = defaultdict(list)
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        for item in serializer.data:
            item = dict(item)
            table_token = item.get('table_token')
            hash_map[table_token].append(dict(item.get('menu', None)))
        return Response(hash_map, status=status.HTTP_200_OK)

class GetOrderByTableToken(RetrieveAPIView):
    queryset         = ''
    serializer_class = OrderItemSerializer
    
    def retrieve(self, request):
        table_token = request.query_params.get('table_token')
        if not table_token: return Response({"message": "Table-token not found"}, status=status.HTTP_400_BAD_REQUEST)
        table_instance = Table.objects.filter(table_token=table_token).first()
        if not table_instance: return Response({"message": "Table-token not present"}, status=status.HTTP_400_BAD_REQUEST)
        order_item = OrderItem.objects.filter(table_token=table_token)
        serializer = self.get_serializer(order_item, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        

class CancelOrder(DestroyAPIView):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer

###### Billing View ######
class ListCreateBill(ListCreateAPIView):
    __bill_amount = 0
    queryset = ''
    serializer_class = BillingSerializer

    def create(self, request):
        sub_total        = 0
        table_token      = request.data.get('table_token', None)
        discount_percent = request.data.get('discount_percent', 0)
        payment_mode     = request.data.get('payment_mode', 'cash')

        if not table_token: return Response(status=status.HTTP_400_BAD_REQUEST)
        order_item_instance = OrderItem.objects.filter(table_token=table_token).prefetch_related('menu')
        order_items         = OrderItemSerializer(order_item_instance, many=True)

        for curr_order_item in order_items.data:
            sub_total += (curr_order_item['menu']['rate'] * curr_order_item['qty'])
        
        self.__bill_amount = sub_total - (discount_percent/100) * sub_total

        with transaction.atomic():
            Billing.objects.create(table_token=table_token, payment_mode=payment_mode, is_paid=True, discount_percent=discount_percent, amount=self.__bill_amount)
            Table.objects.filter(table_token=table_token).update(table_token=None, start_at=None, is_occupied=False)
        return Response(status=status.HTTP_200_OK)