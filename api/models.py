from django.db import models


class ProblemTag(models.Model):
    problem_name = models.CharField(max_length=20)
    tag_name = models.CharField(max_length=20)

    def __str__(self):
        return str(self.problem_name) + " " + self.tag_name