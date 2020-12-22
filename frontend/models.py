from django.db import models
from django.contrib.auth.models import AnonymousUser
from django.conf import settings
from django.db import models


class HistoryUsername(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL ,on_delete=models.CASCADE, null=AnonymousUser)
    oj_name = models.CharField(max_length=20)
    username = models.CharField(max_length=20)

    def __str__(self):
        return self.oj_name + " " + self.username