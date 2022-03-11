from rest_framework import serializers
from .models import Flat
class FlatRoomIdSerializer(serializers.RelatedField):
    def to_representation(self, value):
        
        return value.room_id

class FlatSerializer(serializers.ModelSerializer):
    sublate=FlatRoomIdSerializer(many=True,read_only=True)
    class Meta:
        model=Flat
        fields=['room_id','has_sublate','sublate','description']

# todo make sublate field in a list of room_id string 