# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.2/howto/static-files/
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
TEMPLATE_DIRS = [BASE_DIR/'templates',BASE_DIR/'build']
STATIC_URL = '/static/'
MEDIA_URL ='/media/'
MEDIA_ROOT = BASE_DIR/'media'
STATIC_ROOT = BASE_DIR/'static'/'static_root'/'static'

STATICFILES_DIRS = [
    BASE_DIR/ "static" / "static_dir",
    BASE_DIR/ "frontend" / "build"/"static",
]


MY_INSTALL_APP=[
    'core',
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist'
]