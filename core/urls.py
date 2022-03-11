from django.urls import path,include
from .views import FlatList,FlatDetails
urlpatterns = [
    path('',FlatList.as_view()),
    path('<str:room_id>/',FlatDetails.as_view())
]
