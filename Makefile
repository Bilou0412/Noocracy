# Makefile pour Noocracy
.PHONY: help build up down restart logs ps fclean all dev front-logs back-logs

# Variables
DOCKER_COMPOSE = docker compose -f docker-compose.yml
FRONTEND_SERVICE = frontend
BACKEND_SERVICE = backend

# Affiche l'aide
help:
	@echo "Commandes disponibles :"
	@echo "  make build     - Construit les images Docker (frontend et backend)"
	@echo "  make up        - Démarre tous les conteneurs en arrière-plan"
	@echo "  make down      - Arrête et supprime tous les conteneurs"
	@echo "  make restart   - Redémarre tous les conteneurs"
	@echo "  make logs      - Affiche les logs de tous les conteneurs"
	@echo "  make front-logs - Affiche les logs du frontend uniquement"
	@echo "  make back-logs  - Affiche les logs du backend uniquement"
	@echo "  make ps        - Liste les conteneurs en cours d'exécution"
	@echo "  make fclean    - Arrête les conteneurs, supprime les images et nettoie tout"
	@echo "  make all       - Construit et démarre tous les conteneurs"
	@echo "  make dev       - Lance les services en mode développement (avec hot-reload)"

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
	@echo "Affichage des logs de tous les conteneurs..."
	$(DOCKER_COMPOSE) logs -f

# Affiche les logs du frontend uniquement
front-logs:
	@echo "Affichage des logs du frontend..."
	$(DOCKER_COMPOSE) logs -f $(FRONTEND_SERVICE)

# Affiche les logs du backend uniquement
back-logs:
	@echo "Affichage des logs du backend..."
	$(DOCKER_COMPOSE) logs -f $(BACKEND_SERVICE)

# Liste les conteneurs en cours d'exécution
ps:
	@echo "Conteneurs en cours d'exécution :"
	$(DOCKER_COMPOSE) ps

# Nettoyage complet: arrête les conteneurs, supprime les images et nettoie tout
fclean: down
	@echo "Suppression des images Docker..."
	docker rmi $$(docker images | grep 'noocracy' | awk '{print $$3}') 2>/dev/null || true
	@echo "Nettoyage des ressources Docker non utilisées..."
	docker system prune -f
	docker volume prune -f

# Mode développement avec hot-reload pour les deux services
dev:
	@echo "Démarrage des services en mode développement..."
	@echo "Montage des volumes pour le hot-reload..."
	$(DOCKER_COMPOSE) up -d
	@echo "Services disponibles:"
	@echo "  - Frontend: http://localhost:3000"
	@echo "  - Backend API: http://localhost:8000"

# Construit et démarre les conteneurs
all: build up
	@echo "Application prête !"
	@echo "  - Frontend: http://localhost:3000"
	@echo "  - Backend API: http://localhost:8000"
