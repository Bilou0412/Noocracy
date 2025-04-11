# Makefile pour Noocracy - Service de vérification d'identité
.PHONY: help build run stop logs clean fclean test all dev

# Variables
IMAGE_NAME = noocracy-registration
CONTAINER_NAME = noocracy-registration
PORT = 8000

# Affiche l'aide
help:
	@echo "Commandes disponibles :"
	@echo "  make build     - Construit l'image Docker"
	@echo "  make run       - Démarre le service de vérification"
	@echo "  make stop      - Arrête le service"
	@echo "  make restart   - Redémarre les conteneurs"
	@echo "  make logs      - Affiche les logs du service"
	@echo "  make clean     - Nettoie les ressources non utilisées"
	@echo "  make fclean    - Arrête le service et nettoie tout"
	@echo "  make test      - Exécute un test simple de l'API"
	@echo "  make all       - Construit l'image et démarre le service"
	@echo "  make dev       - Lance le service en mode développement (hot-reload)"

# Construit l'image Docker
build:
	@echo "Construction de l'image Docker..."
	docker build -t $(IMAGE_NAME) .

# Démarre le service
run:
	@echo "Démarrage du service de vérification d'identité..."
	docker run -d --name $(CONTAINER_NAME) -p $(PORT):$(PORT) $(IMAGE_NAME)
	@echo "Service disponible sur http://localhost:$(PORT)"

# Lance le service en mode développement (avec volumes montés pour hot-reload)
dev:
	@echo "Démarrage du service en mode développement..."
	docker run -d --name $(CONTAINER_NAME)_dev \
		-p $(PORT):$(PORT) \
		-v $(PWD)/registration.py:/app/registration.py \
		-v $(PWD)/pics:/app/pics \
		$(IMAGE_NAME) uvicorn registration:app --host 0.0.0.0 --port $(PORT) --reload
	@echo "Service de développement disponible sur http://localhost:$(PORT)"
	@echo "Hot-reload activé : les modifications de code seront appliquées automatiquement"

# Arrête le service
stop:
	@echo "Arrêt du service..."
	docker stop $(CONTAINER_NAME) || true
	docker rm $(CONTAINER_NAME) || true
	docker stop $(CONTAINER_NAME)_dev || true
	docker rm $(CONTAINER_NAME)_dev || true

# Redémarre les conteneurs
restart:
	@echo "Redémarrage des conteneurs..."
	docker restart $(CONTAINER_NAME) || true
	docker restart $(CONTAINER_NAME)_dev || true

# Affiche les logs
logs:
	@echo "Affichage des logs..."
	docker logs -f $(CONTAINER_NAME) || docker logs -f $(CONTAINER_NAME)_dev

# Nettoie les ressources non utilisées
clean:
	@echo "Nettoyage des ressources non utilisées..."
	docker system prune -f

# Arrête le service et nettoie tout
fclean: stop
	@echo "Suppression des images Docker..."
	docker rmi $(IMAGE_NAME) || true
	@echo "Nettoyage des ressources Docker non utilisées..."
	docker system prune -f

# Test simple de l'API
test:
	@echo "Test de l'API de vérification d'identité..."
	@if [ ! -d "./pics" ] || [ -z "$$(ls -A ./pics)" ]; then \
		echo "Erreur: Le dossier 'pics' est vide ou n'existe pas"; \
		echo "Veuillez ajouter des images de test dans le dossier 'pics'"; \
		exit 1; \
	fi
	@echo "Envoi d'une requête de test..."
	@echo "Pour tester manuellement, utilisez la commande:"
	@echo "curl -X POST http://localhost:$(PORT)/verify \\"
	@echo "  -F \"image_id=@./pics/ci_random.jpg\" \\"
	@echo "  -F \"image_selfie=@./pics/selfie.jpg\""

# Construit et démarre le service
all: build run
	@echo "Service prêt ! Accédez à http://localhost:$(PORT)"