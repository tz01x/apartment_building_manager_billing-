from rest_framework import serializers
from .models import (Flat,ExtraCharge,Resident,
                        ElectricityMeterReading,MonthlyPaid)
from .utils import DictSerializer


class DictSerializerWithCostomID(DictSerializer):
    dict_key="room_id"

class FlatRoomIdSerializer(serializers.RelatedField):
    def to_representation(self, value):
        
        return value.room_id

class FlatSerializer(serializers.ModelSerializer):
    sublate=FlatRoomIdSerializer(many=True,read_only=True)
    class Meta:
        model=Flat
        fields=['room_id','has_sublate','sublate','description']
        list_serializer_class = DictSerializerWithCostomID

class ExtraChargeSerializer(serializers.ModelSerializer):
    class Meta:
        model=ExtraCharge
        fields=['id','title','amount']
        list_serializer_class = DictSerializer

class ResidentSerializer(serializers.ModelSerializer):
    flat=FlatRoomIdSerializer(read_only=True)
    extraCharge=ExtraChargeSerializer(many=True,read_only=True)
    class Meta:
        model=Resident
        list_serializer_class = DictSerializer

        fields=[
                'id',
                'name',
                'slug',
                'phone',
                'pictureUrl',
                'join',
                'flat',
                'rent',
                'currently_staying',
                'extraCharge',]

class ElectricityMeterReadingSerializer(serializers.ModelSerializer):
    class Meta:
        model=ElectricityMeterReading
        fields='__all__'


class MonthlyPaidMeterReadingSerializer(serializers.ModelSerializer):
    class Meta:
        model=MonthlyPaid
        fields='__all__'
        list_serializer_class = DictSerializer