from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError

class DisciplineModel(models.Model):
    name = models.CharField(max_length=40)

    def __str__(self):
        return self.name
        
    class Meta:
        verbose_name = 'Дисциплина'
        verbose_name_plural = 'Дисциплины'

class SubjectModel(models.Model):
    title = models.CharField(max_length=40)
    discipline = models.ForeignKey(DisciplineModel, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.title} ({self.discipline})'
    
    class Meta:
        verbose_name = 'Предмет'
        verbose_name_plural = 'Предметы'

class TagModel(models.Model):
    name = models.CharField(max_length=30)
    # discipline = models.ForeignKey(DisciplineModel, on_delete=models.CASCADE)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'Тэг'
        verbose_name_plural = 'Тэги'
class StatusModel(models.Model):
    name = models.CharField(max_length=40)
    default = models.BooleanField(default=False)

    def clean(self):
        if self.default:
            if StatusModel.objects.filter(default=True).exclude(id=self.id).exists():
                raise ValidationError("Только один статус может быть с меткой default")

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'Статус'
        verbose_name_plural = 'Статусы'

class NoteModel(models.Model):
    subject = models.ForeignKey(SubjectModel, on_delete=models.CASCADE)
    title = models.CharField(max_length=40)
    content = models.TextField()
    tags = models.ManyToManyField(TagModel)
    status = models.ForeignKey(StatusModel, on_delete=models.CASCADE, null=True)
    created_date = models.DateTimeField(verbose_name="Дата создания", default=timezone.now)
    count_used = models.IntegerField(verbose_name="Количество прохождениий", default=0)


    def save(self, *args, **kwargs):
        if not self.status:
            default_status = StatusModel.objects.filter(default=True).first()
            if default_status:
                self.status = default_status
            else:
                raise ValidationError("Не назначен стандартный статус для новых заметок")
        super().save(*args, **kwargs)
