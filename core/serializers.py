from rest_framework import serializers
from .models import (Flat, ExtraCharge, Resident,
                     ElectricityMeterReading, MonthlyPaid)
from .utils import DictSerializer


class DictSerializerWithCostomID(DictSerializer):
    dict_key = "room_id"


class FlatRoomIdSerializer(serializers.RelatedField):
    def to_representation(self, value):

        return value.room_id


class FlatSerializer(serializers.ModelSerializer):
    sublate = FlatRoomIdSerializer(many=True, read_only=True)

    class Meta:
        model = Flat
        fields = ['room_id', 'has_sublate', 'sublate', 'description']
        list_serializer_class = DictSerializerWithCostomID


class ExtraChargeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExtraCharge
        fields = ['id', 'title', 'amount']
        list_serializer_class = DictSerializer


class ResidentSerializer(serializers.ModelSerializer):
    flat = FlatRoomIdSerializer(read_only=True)
    extraCharge = ExtraChargeSerializer(many=True, read_only=True)

    class Meta:
        model = Resident
        list_serializer_class = DictSerializer

        fields = [
            'id',
            'name',
            'slug',
            'phone',
            'pictureUrl',
            'join',
            'flat',
            'rent',
            'currently_staying',
            'extraCharge', ]


class ElectricityMeterReadingSerializer(serializers.ModelSerializer):
    bill = serializers.FloatField(source='calculateBill', read_only=True)

    class Meta:
        model = ElectricityMeterReading
        fields = '__all__'
    def validate(self, data):
        fields=['date','resident','current_meterReading']
        for field in fields:
            if data[field] is None:
                raise  serializers.ValidationError({
                field: "This field is required"
            })
            if type(data[field])==int and data[field] <= 0 :
            
                raise  serializers.ValidationError({
                field: f"This field cant not be {data[field]}"
            })
        obj=ElectricityMeterReading.objects.filter(date__month=data['date'].month,
                                                    date__year=data['date'].year,
                                                    resident=data['resident']).first()

        if obj is not None:
            raise serializers.ValidationError({'date':f"duplicated date entry found for '{obj.resident}'"})
                                         
        return data





class MonthlyPaidMeterReadingSerializer(serializers.ModelSerializer):
    calculated_bill=serializers.IntegerField(source='meter_reading.calculateBill',read_only=True,default=0)
    class Meta:
        model = MonthlyPaid
        fields = [
            'created',
            'updated',
            'date',
            'resident',
            'rent_paid',
            'electricity_bill_paid',
            'id',
            'calculated_bill',
            'rent_for_this_month'
        ]
        list_serializer_class = DictSerializer

    def validate(self, data):
        """
        Check that the start is before the stop.

        """
        if data['rent_paid'] == 0 or  data['rent_paid'] is None:
            raise serializers.ValidationError({
                'rent_paid': "This field is required"
            })
        
        if  data['electricity_bill_paid']==0 or data['electricity_bill_paid'] is None:
            raise serializers.ValidationError({
                'electricity_bill_paid': "This field is required"
            })
        
        
        date = data['date']

        if date is None:
            raise serializers.ValidationError({
                'date': "This field is required"
            })

        resident = data['resident']

        if resident is None:
            raise serializers.ValidationError({
                'resident': "This field is required, Please select one from the list"
            })

        # if data['start_date'] > data['end_date']:
        obj = MonthlyPaid.objects.filter(date__month=date.month,
                                         date__year=date.year,
                                         resident=resident).first()

        if obj:
            raise serializers.ValidationError(
                {
                    "date": f"Monthly paid bill already added for '{resident.name}' for the month of {str(date)}. please try to add another month or may you selected wrong user "
                }
            )

        return data
