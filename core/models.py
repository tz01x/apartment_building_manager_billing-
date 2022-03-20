

from django.utils.text import slugify
from django.db import models
from datetime import datetime
from django.core.exceptions import ValidationError
from dateutil.relativedelta import relativedelta
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
    previous_meterReading = models.IntegerField(default=0)
    unit = models.IntegerField(default=12)
    date = models.DateField()
    created = models.DateField(auto_now=True)
    updated = models.DateField(auto_now_add=True)
    resident = models.ForeignKey(
        to=Resident, on_delete=models.RESTRICT, related_name='meter_readings')
    class Meta:
        ordering=['-date']
        
    def __str__(self):
        return str(self.date)+" metter: "+str(self.current_meterReading)

    def clean(self):
        
        if self.date is None:
            raise ValidationError({'date':"Date field can't be empty"})

        try :
            if self.resident is None:
                raise ValidationError({'resident':"Resident field can't be empty"})
        except Exception as e :
            raise ValidationError({'resident':""})


        obj=ElectricityMeterReading.objects.filter(date__month=self.date.month,
                                                    date__year=self.date.year,
                                                    resident=self.resident)
            
        if self.id is not None:
            obj=obj.exclude(id=self.id).first()
        else:
            obj=obj.first()

        if obj:
            raise ValidationError({'date':"duplicated date entry found"})

        if self.previous_meterReading==0:
            previous_month=self.date - relativedelta(months=1)
            obj=ElectricityMeterReading.objects.filter(resident=self.resident,date__year=previous_month.year,date__month=previous_month.month).first()
            if obj:
                self.previous_meterReading=obj.current_meterReading
            else:
                raise ValidationError({"previous_meterReading":"Electric meter reading for previous monthe not found!, please write you previous month meter reading"})

    def save(self,*args,**kwargs):
        return super(ElectricityMeterReading,self).save(*args,**kwargs)
    @property                     
    def calculateBill(self):
        return (self.current_meterReading - self.previous_meterReading) * self.unit


class MonthlyPaid(models.Model):
    created = models.DateField(auto_now=True)
    updated = models.DateField(auto_now_add=True)
    date = models.DateField()
    resident = models.ForeignKey(to=Resident, on_delete=models.RESTRICT, related_name='monthly_paid')
    meter_reading=models.OneToOneField(ElectricityMeterReading, on_delete=models.SET_NULL,null=True,blank=True)
    rent_paid=models.FloatField()
    electricity_bill_paid=models.FloatField()
    
    def save(self,*args, **kwargs):
        
        if self.meter_reading is None:
            obj=ElectricityMeterReading.objects.filter(date__month=self.date.month,date__year=self.date.year,resident=self.resident).first()
            if obj:
                self.meter_reading=obj
        
        return super(MonthlyPaid, self).save(*args, **kwargs)

    def __str__(self):
        return str(self.created.strftime("%B"))+" "+self.resident.name
    
    def clean(self):
        
        if self.date is None:
            raise ValidationError({'date':"Date field can't be empty"})

        try :
            if self.resident is None:
                raise ValidationError({'resident':"Resident field can't be empty"})
        except Exception as e :
            raise ValidationError({'resident':""})


        obj=MonthlyPaid.objects.filter(date__month=self.date.month,
                                                    date__year=self.date.year,
                                                    resident=self.resident)
            
        if self.id is not None:
            obj=obj.exclude(id=self.id).first()
        else:
            obj=obj.first()

        if obj:
            raise ValidationError({'date':"duplicated date entry found"})
