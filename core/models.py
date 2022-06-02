

from django.utils.text import slugify
from django.db import models
from django.db.models import Sum
from datetime import datetime
from django.core.exceptions import ValidationError
from dateutil.relativedelta import relativedelta
from datetime import datetime
import uuid




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
    title_bn = models.CharField(max_length=20,null=True,blank=True)
    amount = models.FloatField()
    def __str__(self) -> str:           
        return self.title


class RentHistory(models.Model):
    rent = models.FloatField()
    created = models.DateTimeField(auto_now=True)
    updated = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.rent )

    class Meta:
        ordering=['-created']

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
    rent_history=models.ManyToManyField(RentHistory)
    
    extraCharge = models.ManyToManyField(to=ExtraCharge,blank=True)
    # TODO: add a column name 'unit' 

    @property
    def rent(self):
        r= self.rent_history.order_by('-created').first()

        if r :
            return r.rent
        return 0
    @property
    def getExtraCharges(self):
        try:
            amount=self.extraCharge.all().aggregate(Sum('amount'))['amount__sum']
            if amount is None:
                return 0
            return amount
        except Exception as e:
            print(e)
            return 0

    def save(self,*args,**kwargs):
        if(self.slug):
            self.slug=slugify(self.name)+"_"+str(uuid.uuid4())[:8]
        return super(Resident,self).save(*args,**kwargs)


    def __str__(self):
        return self.name

# current_reading- prev_reading * current_unit

class ElectricityMeterReading(models.Model):
    current_meterReading = models.IntegerField()
    previous_meterReading = models.IntegerField(default=0)
    unit = models.IntegerField(default=8)
    date = models.DateField()
    created = models.DateField(auto_now=True)
    updated = models.DateField(auto_now_add=True)
    resident = models.ForeignKey(
        to=Resident, on_delete=models.CASCADE, related_name='meter_readings')
    set_bill=models.IntegerField(default=0)
    class Meta:
        ordering=['-date']
        
    def __str__(self):
        return str(self.date)+" meter: "+str(self.current_meterReading)

    def clean(self):
        
        if self.date is None:
            raise ValidationError({'date':"Date field can't be empty"})

        try :
            if self.resident is None:
                raise ValidationError({'resident':"Resident field can't be empty"})
        except Exception as e :
            raise ValidationError({'resident':"l"})


        obj=ElectricityMeterReading.objects.filter(date__month=self.date.month,
                                                    date__year=self.date.year,
                                                    resident=self.resident)
            
        if self.id is not None:
            obj=obj.exclude(id=self.id).first()
        else:
            obj=obj.first()

        if obj:
            raise ValidationError({'date':"duplicated date entry found"})

        # if self.previous_meterReading==0:
        #     previous_month=self.date - relativedelta(months=1)
        #     obj=ElectricityMeterReading.objects.filter(resident=self.resident,date__year=previous_month.year,date__month=previous_month.month).first()
        #     if obj:
        #         self.previous_meterReading=obj.current_meterReading
        #     else:
        #         raise ValidationError({"previous_meterReading":"Electric meter reading for previous monthe not found!, please write you previous month meter reading"})

    def save(self,*args,**kwargs):
        if self.previous_meterReading==0:
            previous_month=self.date - relativedelta(months=1)
            obj=ElectricityMeterReading.objects.filter(resident=self.resident,date__year=previous_month.year,date__month=previous_month.month).first()
            if obj:
                self.previous_meterReading=obj.current_meterReading
        
        return super(ElectricityMeterReading,self).save(*args,**kwargs)
    @property                     
    def calculateBill(self):
        try:    
            if self.set_bill == 0 :
                return (self.current_meterReading - self.previous_meterReading) * self.unit
            return self.set_bill
        except:
            return 0


class MonthlyPaid(models.Model):
    created = models.DateField(auto_now=True)
    updated = models.DateField(auto_now_add=True)
    date = models.DateField()
    resident = models.ForeignKey(to=Resident, on_delete=models.RESTRICT, related_name='monthly_paid')
    meter_reading=models.OneToOneField(ElectricityMeterReading, on_delete=models.SET_NULL,null=True,blank=True)
    rent_paid=models.FloatField()
    electricity_bill_paid=models.FloatField()
    rent_for_this_month=models.FloatField(blank=True,null=True)
    
    def save(self,*args, **kwargs):
        
        if self.meter_reading is None:
            obj=ElectricityMeterReading.objects.filter(date__month=self.date.month,date__year=self.date.year,resident=self.resident).first()
            if obj:
                self.meter_reading=obj
        if self.rent_for_this_month is None:
            self.rent_for_this_month=self.resident.rent
        
        return super(MonthlyPaid, self).save(*args, **kwargs)

    def __str__(self):
        return str(self.created.strftime("%B %Y"))+" | "+self.resident.name+" for "+(str(self.date.strftime('%B %Y')))
    
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
