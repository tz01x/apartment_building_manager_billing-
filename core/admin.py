from django.contrib import admin

# Register your models here.
from .models import *

admin.site.register(Flat)
admin.site.register(ExtraCharge)
admin.site.register(Resident)
admin.site.register(ElectricityMeterReading)
admin.site.register(MonthlyPaid)