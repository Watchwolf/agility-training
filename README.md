agility-training
================

Agility-Training est un site internet permettant de gérer une communauté d'utilisateur créant et partageant des parcours d'agility (parcours d'obstacles à réaliser avec un chien).

Le site internet est disponible en ligne à l'adresse http://agility-training.fr

Installation d'un environnement de développement
================

Agility-Training est écrit en Python avec le framework Django. Il est donc nécessaire d'installation Python-2.6, les autres dépendances tels que Django sont directement incluses dans l'application.

La configuration d'une application Django se fait dans agility/agility/settings.py, le fichier inclus le fichier settings_private.py, c'est ce fichier qu'il faut configurer.
Pour un environnement de développement vous devez définir les variables:
* ligne 27, ajouter votre hostname pour être détecté comme machine de dévelopmment
* DATABASES
* EMAIL_HOST et dérivé pour l'authentification
* LOCALE_PATHS
* STATIC_ROOT
* STATIC_URL
* FACEBOOK_APP_ID
* FACEBOOK_APP_SECRET
* STATICFILES_DIRS
* TEMPLATE_DIRS

Il est également nécessaire que vous configurié la variable d'environnement PYTHONPATH pour executer le serveur. Un exemple se trouve dans agility/profile.sh

Ensuite pour executer le serveur:
* se rendre dans le dossier agility
* source profile.sh
* python manage.py runserver

