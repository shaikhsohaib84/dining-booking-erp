from django.urls import path
from .views import (
        TableList, TableInsert, TableDelete, TableUpdate,
        AddMenu, ListMenu, UpdateMenu, DeleteMenu,
        ListCreateOrder, CancelOrder, GetOrderByTableToken,
        ListCreateBill,
    )

urlpatterns = [
    # table urls
    path('get-table/', TableList.as_view()),
    path('add-table/', TableInsert.as_view()),
    path('delete-table/<int:pk>/', TableDelete.as_view()),
    path('update-table/<int:pk>/', TableUpdate.as_view()),

    # menu urls
    path('add-menu-item/' , AddMenu.as_view()),
    path('show-menu-item/', ListMenu.as_view()),
    path('update-menu-item/<int:pk>/', UpdateMenu.as_view()),
    path('delete-menu/<int:pk>/', DeleteMenu.as_view()),

    # order urls
    path('create-order/', ListCreateOrder.as_view()),
    path('list-orders/', ListCreateOrder.as_view()),
    path('get-order-by-table-id/', GetOrderByTableToken.as_view()),
    path('cancel-order/<int:pk>/', CancelOrder.as_view()),

    # billing urls
    path('pay-bill/', ListCreateBill.as_view()),
]