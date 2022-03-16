

from django.utils.text import slugify
from django.db import models
from datetime import datetime

class Flat(models.Model):
    room_id = models.CharField(unique=True, max_length=4)
    has_sublate = models.BooleanField(default=False)
    sublate = models.ManyToManyField(to='Flat',blank=True,null=True)
    description = models.TextField(blank=True)
    def __str__(self) :
        return self.room_id
    def save(self,*args, **kwargs):
        # 
        return super().save(*args, **kwargs)
    class Meta:
        ordering=['room_id']

class ExtraCharge(models.Model):
    title = models.CharField(max_length=20)
    title_bn = models.CharField(max_length=20)
    amount = models.FloatField()
    def __str__(self) -> str:
        return self.title


class Resident(models.Model):
    name = models.CharField(max_length=50)
    slug=models.SlugField(blank=True,null=True,unique=True)
    phone = models.CharField(max_length=14)
    nid = models.CharField(max_length=50)
    pictureUrl = models.CharField(default="/media/default.png",max_length=200)
    join = models.DateField()
    created = models.DateField(auto_now=True)
    updated = models.DateField(auto_now_add=True)
    flat = models.ForeignKey(
        to=Flat, related_name='residents', on_delete=models.CASCADE)
    currently_staying=models.BooleanField(default=False)
    rent = models.FloatField()
    extraCharge = models.ManyToManyField(to=ExtraCharge,blank=True)

    def save(self,*args,**kwargs):
        self.slug=slugify(self.name)
        return super(Resident,self).save(*args,**kwargs)


    def __str__(self):
        return self.name

# current_reading- prev_reading * current_unit


class ElectricityMeterReading(models.Model):
    current_meterReading = models.IntegerField()
    previous_meterReading = models.IntegerField()
    unit = models.IntegerField(default=12)
    created = models.DateField(auto_now=True)
    updated = models.DateField(auto_now_add=True)
    resident = models.ForeignKey(
        to=Resident, on_delete=models.RESTRICT, related_name='meter_readings')

    def __str__(self):
        return str(self.created)+" metter: "+self.meterReading


class MonthlyPaid(models.Model):
    created = models.DateField(auto_now=True)
    updated = models.DateField(auto_now_add=True)
    
    resident = models.ForeignKey(
        to=Resident, on_delete=models.RESTRICT, related_name='monthly_paid')

    rent_paid=models.FloatField()
    electricity_bill_paid=models.FloatField()

    def __str__(self):
        return str(self.created.strftime("%B"))+" "+self.resident.name

