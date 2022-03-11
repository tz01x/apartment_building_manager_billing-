from django.shortcuts import render

# Create your views here.


from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status

from .models import Flat
from .serializers import FlatSerializer

class FlatList(generics.ListCreateAPIView):
    queryset = Flat.objects.all()
    serializer_class = FlatSerializer

class FlatDetails(generics.RetrieveUpdateAPIView):
    queryset = Flat.objects.all()
    serializer_class = FlatSerializer
    lookup_field='room_id'

