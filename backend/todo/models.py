from django.db import models

# Create your models here.

class Item(models.Model):
  label_text = models.CharField(max_length=200)
  added_date = models.DateTimeField("date added")
  is_done = models.BooleanField()

  def __str__(self):
    return self.label_text