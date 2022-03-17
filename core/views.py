from django.shortcuts import render

# Create your views here.


from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from .models import *
from .serializers import *

class FlatList(generics.ListCreateAPIView):
    queryset = Flat.objects.all()
    serializer_class = FlatSerializer

class FlatDetails(generics.RetrieveUpdateAPIView):
    queryset = Flat.objects.all()
    serializer_class = FlatSerializer
    lookup_field='room_id'

def addorRemoveToSublate(request,room_id,addTo=True):
    obj=get_object_or_404(Flat,room_id=room_id)
    sublets=request.data.get('sublate',None)
    if sublets:
        sublateObjs=[get_object_or_404(Flat,room_id=sublate).id for sublate in sublets]

        if addTo:
            obj.sublate.add(*sublateObjs)
        else:
            obj.sublate.remove(*sublateObjs)

        return Response({"data":FlatSerializer(obj).data})
        
    return Response(data={"message": "invalid data"},status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def addSublate(request,room_id):
    return addorRemoveToSublate(request, room_id)

@api_view(['POST'])
def removeSublate(request,room_id):
    return addorRemoveToSublate(request, room_id,False)

class ExtraChargeList(generics.ListAPIView):
    queryset = ExtraCharge.objects.all()
    serializer_class = ExtraChargeSerializer

class ResidentList(generics.ListAPIView):
    queryset = Resident.objects.all()
    serializer_class = ResidentSerializer

class ElectricityMeterReadingList(generics.ListCreateAPIView):
    queryset = ElectricityMeterReading.objects.all()
    serializer_class = ElectricityMeterReadingSerializer

class MonthlyPaidMeterReadingList(generics.ListAPIView):
    queryset = MonthlyPaid.objects.all()
    serializer_class = MonthlyPaidMeterReadingSerializer