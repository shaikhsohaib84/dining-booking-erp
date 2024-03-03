from django.urls import path
from .views import (
        TableList, TableInsert, TableDelete, 
        AddMenu, ListMenu, UpdateMenu, 
        CreateOrder,
    )

urlpatterns = [
    # table urls
    path('get-table/', TableList.as_view()),
    path('add-table/', TableInsert.as_view()),
    path('delete-table/<int:pk>/', TableDelete.as_view()),

    # menu urls
    path('add-menu-item/' , AddMenu.as_view()),
    path('show-menu-item/', ListMenu.as_view()),
    path('update-menu-item/<int:pk>/', UpdateMenu.as_view()),

    # order urls
    path('create-order/', CreateOrder.as_view()),
    path('list-orders/', CreateOrder.as_view()),
]