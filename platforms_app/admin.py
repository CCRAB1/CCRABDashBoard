# myapp/admin.py
from django.contrib import admin
from django.contrib.gis.admin import GISModelAdmin  # requires GeoDjango; remove if not using
from . import models

# -----------------------
# Inlines for FK relations
# -----------------------

class PlatformInline(admin.TabularInline):
    model = models.Platform
    fk_name = "organization_id"
    fields = ('row_id', 'row_entry_date', 'row_update_date', 'type_id', 'short_name', 'platform_handle')
    extra = 0
    show_change_link = True

class SampleInline(admin.TabularInline):
    model = models.Sample
    fk_name = "organization_id"
    fields = ('row_id', 'row_entry_date', 'row_update_date', 'name', 'description', 'sample_date')
    extra = 0
    show_change_link = True

class M_scalar_typeInline(admin.TabularInline):
    model = models.M_scalar_type
    fk_name = "obs_type_id"
    fields = ('row_id', 'uom_type_id')
    extra = 0
    show_change_link = True

class M_scalar_typeInline2(admin.TabularInline):
    model = models.M_scalar_type
    fk_name = "uom_type_id"
    fields = ('row_id', 'obs_type_id')
    extra = 0
    show_change_link = True

class M_typeInline(admin.TabularInline):
    model = models.M_type
    fk_name = "m_scalar_type_id"
    fields = ('row_id', 'num_types', 'description', 'm_scalar_type_id_2', 'm_scalar_type_id_3', 'm_scalar_type_id_4')
    extra = 0
    show_change_link = True

class SensorInline(admin.TabularInline):
    model = models.Sensor
    fk_name = "platform_id"
    fields = ('row_id', 'row_entry_date', 'row_update_date', 'type_id', 'short_name', 'm_type_id')
    extra = 0
    show_change_link = True

class Platform_statusInline(admin.TabularInline):
    model = models.Platform_status
    fk_name = "platform_id"
    fields = ('row_id', 'row_entry_date', 'begin_date', 'expected_end_date', 'end_date', 'row_update_date')
    extra = 0
    show_change_link = True

class Platform_imagesInline(admin.TabularInline):
    model = models.Platform_status
    fk_name = "platform_id"
    fields = ('row_id', 'row_entry_date', 'name', 'description', 'filepath')
    extra = 0
    show_change_link = True


class Sensor_statusInline(admin.TabularInline):
    model = models.Sensor_status
    fk_name = "platform_id"
    fields = ('row_id', 'sensor_id', 'sensor_name', 'row_entry_date', 'begin_date', 'end_date')
    extra = 0
    show_change_link = True

class SensorInline2(admin.TabularInline):
    model = models.Sensor
    fk_name = "m_type_id"
    fields = ('row_id', 'row_entry_date', 'row_update_date', 'platform_id', 'type_id', 'short_name')
    extra = 0
    show_change_link = True

class Multi_obsInline(admin.TabularInline):
    model = models.Multi_obs
    fk_name = "m_type_id"
    fields = ('row_id', 'row_entry_date', 'row_update_date', 'platform_handle', 'sensor_id', 'm_date')
    extra = 0
    show_change_link = True

class Multi_obsInline2(admin.TabularInline):
    model = models.Multi_obs
    fk_name = "sensor_id"
    fields = ('row_id', 'row_entry_date', 'row_update_date', 'platform_handle', 'm_type_id', 'm_date')
    extra = 0
    show_change_link = True

class Sensor_statusInline2(admin.TabularInline):
    model = models.Sensor_status
    fk_name = "sensor_id"
    fields = ('row_id', 'sensor_name', 'platform_id', 'row_entry_date', 'begin_date', 'end_date')
    extra = 0
    show_change_link = True

class Sample_answerInline(admin.TabularInline):
    model = models.Sample_answer
    fk_name = "sample_id"
    fields = ('row_id', 'row_entry_date', 'row_update_date', 'form_question_id', 'form_id', 'form_version')
    extra = 0
    show_change_link = True

class Sample_attachmentInline(admin.TabularInline):
    model = models.Sample_attachment
    fk_name = "sample_id"
    fields = ('row_id', 'row_entry_date', 'row_update_date', 'filename', 'mime_type', 'caption')
    extra = 0
    show_change_link = True

@admin.register(models.Organization)
class OrganizationAdmin(admin.ModelAdmin):
    fields = ('short_name', 'long_name', 'description', 'active', 'url')
    list_display = ('row_id', 'short_name', 'active', 'row_entry_date', 'row_update_date', 'long_name')
    search_fields = ('short_name', 'long_name', 'url')
    list_filter = ('active',)
    readonly_fields = ('row_entry_date', 'row_update_date')
    date_hierarchy = "row_entry_date"
    inlines = [PlatformInline, SampleInline]

@admin.register(models.Collection_type)
class Collection_typeAdmin(admin.ModelAdmin):
    list_display = ('row_id', 'type_name', 'row_entry_date', 'row_update_date', 'description')
    search_fields = ('type_name',)
    readonly_fields = ('row_entry_date', 'row_update_date')
    date_hierarchy = "row_entry_date"

@admin.register(models.Collection_run)
class Collection_runAdmin(admin.ModelAdmin):
    list_display = ('row_id', 'short_name', 'row_entry_date', 'row_update_date', 'type_id', 'long_name')
    search_fields = ('short_name', 'long_name')
    list_filter = ('type_id',)
    readonly_fields = ('row_entry_date', 'row_update_date')
    date_hierarchy = "row_entry_date"

@admin.register(models.Platform_type)
class Platform_typeAdmin(admin.ModelAdmin):
    list_display = ('row_id', 'short_name', 'type_name', 'description')
    search_fields = ('type_name', 'short_name')

@admin.register(models.Platform_metadata)
class Platform_metadataAdmin(admin.ModelAdmin):
    list_display = ('row_id', 'row_entry_date', 'row_update_date', 'meta_key', 'meta_value')
    search_fields = ('meta_key',)
    readonly_fields = ('row_entry_date', 'row_update_date')
    date_hierarchy = "row_entry_date"

@admin.register(models.Platform)
class PlatformAdmin(GISModelAdmin):
    list_display = ('row_id', 'short_name', 'platform_handle', 'active', 'begin_date', 'end_date', 'row_entry_date')
    search_fields = ('short_name', 'long_name', 'url')
    list_filter = ('type_id', 'active')
    readonly_fields = ('row_entry_date', 'row_update_date')
    date_hierarchy = "row_entry_date"
    inlines = [SensorInline, Platform_statusInline, Sensor_statusInline]

@admin.register(models.Uom_type)
class Uom_typeAdmin(admin.ModelAdmin):
    list_display = ('row_id', 'standard_name', 'definition', 'display')
    search_fields = ('standard_name',)
    inlines = [M_scalar_typeInline2]

@admin.register(models.Obs_type)
class Obs_typeAdmin(admin.ModelAdmin):
    list_display = ('row_id', 'standard_name', 'definition')
    search_fields = ('standard_name',)
    inlines = [M_scalar_typeInline]

'''
@admin.register(models.M_scalar_type)
class M_scalar_typeAdmin(admin.ModelAdmin):
    list_display = ('row_id', 'obs_type_id', 'uom_type_id')
    inlines = [M_typeInline]
'''
'''
@admin.register(models.M_type)
class M_typeAdmin(admin.ModelAdmin):
    list_display = ('row_id', 'num_types', 'description', 'm_scalar_type_id', 'm_scalar_type_id_2', 'm_scalar_type_id_3')
    inlines = [SensorInline2]
'''
@admin.register(models.Sensor)
class SensorAdmin(admin.ModelAdmin):
    list_display = ('row_id', 'short_name', 'active', 'begin_date', 'end_date', 'row_entry_date')
    search_fields = ('short_name', 'url')
    list_filter = ('platform_id', 'type_id', 'm_type_id', 'active')
    readonly_fields = ('row_entry_date', 'row_update_date')
    date_hierarchy = "row_entry_date"
    inlines = [Sensor_statusInline2]
    #inlines = [Multi_obsInline2, Sensor_statusInline2]

'''
@admin.register(models.Multi_obs)
class Multi_obsAdmin(GISModelAdmin):
    list_display = ('row_id', 'platform_handle', 'row_entry_date', 'row_update_date', 'sensor_id', 'm_type_id')
    list_filter = ('m_type_id',)
    readonly_fields = ('row_entry_date', 'row_update_date')
    date_hierarchy = "row_entry_date"
'''
@admin.register(models.Platform_status)
class Platform_statusAdmin(admin.ModelAdmin):
    list_display = ('row_id', 'platform_handle', 'status', 'begin_date', 'end_date', 'row_entry_date')
    list_filter = ('status', 'platform_id')
    readonly_fields = ('row_entry_date', 'row_update_date')
    date_hierarchy = "row_entry_date"

@admin.register(models.Sensor_status)
class Sensor_statusAdmin(admin.ModelAdmin):
    list_display = ('row_id', 'status', 'begin_date', 'end_date', 'row_entry_date', 'sensor_id')
    search_fields = ('sensor_name',)
    list_filter = ('platform_id', 'status')
    readonly_fields = ('row_entry_date', 'row_update_date')
    date_hierarchy = "row_entry_date"

@admin.register(models.Product_type)
class Product_typeAdmin(admin.ModelAdmin):
    list_display = ('row_id', 'type_name', 'description')
    search_fields = ('type_name',)

@admin.register(models.Timestamp_lkp)
class Timestamp_lkpAdmin(admin.ModelAdmin):
    list_display = ('row_id', 'row_entry_date', 'row_update_date', 'product_id', 'pass_timestamp', 'filepath')
    search_fields = ('filepath',)
    readonly_fields = ('row_entry_date', 'row_update_date')
    date_hierarchy = "row_entry_date"

@admin.register(models.Sample)
class SampleAdmin(GISModelAdmin):
    list_display = ('row_id', 'name', 'row_entry_date', 'row_update_date', 'organization_id', 'description')
    search_fields = ('name', 'postal_code', 'country_code')
    readonly_fields = ('row_entry_date', 'row_update_date')
    date_hierarchy = "row_entry_date"
    inlines = [Sample_answerInline, Sample_attachmentInline]

@admin.register(models.Sample_answer)
class Sample_answerAdmin(admin.ModelAdmin):
    list_display = ('row_id', 'row_entry_date', 'row_update_date', 'sample_id', 'form_question_id', 'form_id')
    search_fields = ('form_question_id', 'question_text')
    readonly_fields = ('row_entry_date', 'row_update_date')
    date_hierarchy = "row_entry_date"

@admin.register(models.Sample_attachment)
class Sample_attachmentAdmin(admin.ModelAdmin):
    list_display = ('row_id', 'filename', 'row_entry_date', 'row_update_date', 'sample_id', 'mime_type')
    search_fields = ('filename', 'storage_url')
    readonly_fields = ('row_entry_date', 'row_update_date')
    date_hierarchy = "row_entry_date"

@admin.register(models.Platform_images)
class Platform_imagesAdmin(admin.ModelAdmin):
    list_display = ('name','description','filepath')
    search_fields = ['name']

