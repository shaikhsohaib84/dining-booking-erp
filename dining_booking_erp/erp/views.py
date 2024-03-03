from collections import defaultdict

# django DRF imports
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView, ListCreateAPIView

# application imports
from .models import Table, Menu, OrderItem
from .serializers import TableSerializer, MenuSerializer, OrderItemSerializer

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
class CreateOrder(ListCreateAPIView):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer

    def create(self, request):
        menu_data = request.data.get('menu', [])
        table_token = request.data.get('table_token')
        bulk_orders = []
        menu_id_hashmap = set()
        for item in menu_data:
            if item.get('id', None) in menu_id_hashmap: continue
            menu_instance = Menu.objects.filter(id=item.get('id', None)).first()
            if menu_instance:
                menu_id_hashmap.add(item.get('id'))
                bulk_orders.append(OrderItem(table_token=table_token, menu=menu_instance, qty=item.get('qty')))

        OrderItem.objects.bulk_create(bulk_orders)
        return Response(status=status.HTTP_201_CREATED)

    def list(self, request):
        hash_map = defaultdict(list)
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        for item in serializer.data:
            item = dict(item)
            table_token = item.get('table_token')
            hash_map[table_token].append(dict(item.get('menu', None)))
            print(item)
        return Response(hash_map, status=status.HTTP_200_OK)

# class OrderItemList(ListAPIView):
#     queryset = 