from django.contrib import admin

# Register your models here.
from .models import *

admin.site.register(Flat)
admin.site.register(RentHistory)
admin.site.register(ExtraCharge)

@admin.register(Resident)
class ResidentAdmin(admin.ModelAdmin):
    readonly_fields=['rent']
    
@admin.register(ElectricityMeterReading)
class ElectricityMeterReadingAdmin(admin.ModelAdmin):
    readonly_fields=['calculateBill']
 
admin.site.register(MonthlyPaid)