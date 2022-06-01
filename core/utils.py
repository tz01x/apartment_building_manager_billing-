import datetime

from django.http import Http404

from rest_framework import serializers
from rest_framework.utils.serializer_helpers import ReturnDict

from .models import ElectricityMeterReading

class DictSerializer(serializers.ListSerializer):
    """
    Overrides default ListSerializer to return a dict with a custom field from
    each item as the key. Makes it easier to normalize the data so that there
    is minimal nesting. dict_key defaults to 'id' but can be overridden.
    """
    dict_key = 'id'
    @property
    def data(self):
        """
        Overriden to return a ReturnDict instead of a ReturnList.
        """
        ret = super(serializers.ListSerializer, self).data
        return ReturnDict(ret, serializer=self)
    def to_representation(self, data):
        """
        Converts the data from a list to a dictionary.
        """
        items = super(DictSerializer, self).to_representation(data)
        return {item[self.dict_key]: item for item in items}

def make2d(objs,innerArrCount=3):
    count=len(objs)
    return (objs[i:i+innerArrCount] for i in range(0,count,innerArrCount))

def generatePdfContext(request)->dict:
    date_str=request.GET.get('date',None)
    if date_str is None:
        raise Http404('{"details":"date params is required"}',content_type="application/json")
    try:
        dateObj = datetime.datetime.strptime(date_str, '%Y-%m-%d')
    except ValueError as e:
        raise Http404(f'{"details":"{e}"}',content_type="application/json") 
    
    objList=ElectricityMeterReading.objects.select_related('resident').filter(date__month=dateObj.month,date__year=dateObj.year)
    
    context={
            "objs": make2d(objList)
        }
    return context