from django.db import models
import uuid

MENU_TYPES = [
    ('veg', 'Vegetarian'),
    ('non_veg', 'Non-Vegetarian'),
    ('drink', 'Drink'),
]

MENU_ITEMS = [
    ('pizza', 'Pizza'),
    ('burger', 'Burger'),
    ('sandwich', 'Sandwich'),
    ('fries', 'Fries'),
    ('drink', 'Drink')
]

PAYMENT_TYPES = [
    ('cash', 'Cash'),
    ('online', 'Online')
]

class Table(models.Model):
    id          = models.BigAutoField(primary_key=True)
    table_token = models.TextField(null=True, blank=False) # models.UUIDField(default=uuid.uuid4, editable=False, unique=True) 
    is_occupied = models.BooleanField(default=False, null=False, blank=False)
    start_at    = models.DateTimeField(default=None, null=True, blank=True)
    end_at      = models.DateTimeField(default=None, null=True, blank=True)
    created_at  = models.DateTimeField(auto_now_add=True, null=False, blank=False)
    
    class Meta:
        db_table = "table"
        # ordering = ["id"]

class Menu(models.Model):
    id         = models.BigAutoField(primary_key=True)
    name       = models.CharField(max_length=100, blank=False, null=False)
    menu_type  = models.CharField(choices=MENU_TYPES, max_length=20, default="veg")
    menu_item  = models.CharField(choices=MENU_ITEMS,  max_length=20, default="pizza")
    rate       = models.FloatField(default=0, blank=False, null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'menu'
        ordering = ["id"]

class OrderItem(models.Model):
    id = models.BigAutoField(primary_key=True)
    table_token = models.TextField(unique=True, blank=False, null=False)
    qty = models.IntegerField(default=1, blank=False, null=False)
    menu = models.ForeignKey(Menu, on_delete=models.CASCADE)

    class Meta:
        db_table = "order_item"

class Billing(models.Model):
    id               = models.BigAutoField(primary_key=True)
    table_token      = models.TextField(unique=True, blank=False, null=False)
    payment_mode     = models.CharField(max_length=20, choices=PAYMENT_TYPES, default="online", blank=False, null=False)
    is_paid          = models.BooleanField(default=False, null=False, blank=False)
    discounted_amt   = models.FloatField(default=0, null=False, blank=False)
    bill_amount      = models.FloatField(default=0, null=False, blank=False)

    class Meta:
        db_table = "billing"