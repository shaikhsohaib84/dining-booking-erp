from rest_framework import serializers
from .models import Table, Menu, OrderItem, Billing

class TableSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        return Table.objects.create(**validated_data)
    
    class Meta:
        model = Table
        fields = '__all__'

class MenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = Menu
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    menu =  MenuSerializer()
        
    class Meta:
        model = OrderItem
        fields = ['id', 'table_token', 'qty', 'menu']

class BillingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Billing
        fields = ['id', 'table_token', 'payment_mode', 'is_paid', 'discounted_amt']