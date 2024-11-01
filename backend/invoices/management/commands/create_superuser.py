from django.core.management.base import BaseCommand
from django.contrib.auth.models import User


class Command(BaseCommand):
    help = 'Creates a superuser with username "superuser" and password "OCE1234"'

    def handle(self, *args, **options):
        username = 'superuser'
        password = 'OCE1234'
        email = ''

        if User.objects.filter(username=username).exists():
            self.stdout.write(
                self.style.WARNING(f'User "{username}" already exists. Skipping creation.')
            )
        else:
            User.objects.create_superuser(username=username, email=email, password=password)
            self.stdout.write(
                self.style.SUCCESS(f'Successfully created superuser "{username}"')
            )

