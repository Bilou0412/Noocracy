# Makefile pour Noocracy
.PHONY: help build up down restart logs ps fclean

# Variables
DOCKER_COMPOSE = docker compose -f docker-compose.yml

# Affiche l'aide
help:
	@echo "Commandes disponibles :"
	@echo "  make build     - Construit les images Docker"
	@echo "  make up        - Démarre les conteneurs en arrière-plan"
	@echo "  make down      - Arrête et supprime les conteneurs"
	@echo "  make restart   - Redémarre les conteneurs"
	@echo "  make logs      - Affiche les logs des conteneurs"
	@echo "  make ps        - Liste les conteneurs en cours d'exécution"
	@echo "  make fclean    - Arrête les conteneurs, supprime les images et nettoie tout"
	@echo "  make all       - Construit et démarre les conteneurs"

# Construit les images Docker
build:
	@echo "Construction des images Docker..."
	$(DOCKER_COMPOSE) build

# Démarre les conteneurs en arrière-plan
up:
	@echo "Démarrage des conteneurs..."
	$(DOCKER_COMPOSE) up -d

# Arrête et supprime les conteneurs
down:
	@echo "Arrêt des conteneurs..."
	$(DOCKER_COMPOSE) down

# Redémarre les conteneurs
restart:
	@echo "Redémarrage des conteneurs..."
	$(DOCKER_COMPOSE) restart

# Affiche les logs des conteneurs
logs:
	@echo "Affichage des logs..."
	$(DOCKER_COMPOSE) logs -f

# Liste les conteneurs en cours d'exécution
ps:
	@echo "Conteneurs en cours d'exécution :"
	$(DOCKER_COMPOSE) ps

# Nettoyage complet: arrête les conteneurs, supprime les images et nettoie tout
fclean: down
	@echo "Suppression des images Docker du projet..."
	-docker rmi $$(docker images | grep 'noocracy' | awk '{print $$3}') 2>/dev/null || true
	@echo "Nettoyage des ressources Docker non utilisées..."
	docker system prune -f
	docker volume prune -f

# Construit et démarre les conteneurs
all: build up
	@echo "Application prête ! Accédez à http://localhost:3000"
