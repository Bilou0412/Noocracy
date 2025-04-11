# Makefile pour Noocracy - Service de vérification d'identité
.PHONY: help build run stop logs clean fclean test all

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
	@echo "  make logs      - Affiche les logs du service"
	@echo "  make clean     - Nettoie les ressources non utilisées"
	@echo "  make fclean    - Arrête le service et nettoie tout"
	@echo "  make test      - Exécute un test simple de l'API"
	@echo "  make all       - Construit l'image et démarre le service"

# Construit l'image Docker
build:
	@echo "Construction de l'image Docker..."
	docker build -t $(IMAGE_NAME) .

# Démarre le service
run:
	@echo "Démarrage du service de vérification d'identité..."
	docker run -d --name $(CONTAINER_NAME) -p $(PORT):$(PORT) $(IMAGE_NAME)
	@echo "Service disponible sur http://localhost:$(PORT)"

# Arrête le service
stop:
	@echo "Arrêt du service..."
	docker stop $(CONTAINER_NAME) || true
	docker rm $(CONTAINER_NAME) || true

# Affiche les logs
logs:
	@echo "Affichage des logs..."
	docker logs -f $(CONTAINER_NAME)

# Nettoie les ressources non utilisées
clean:
	@echo "Nettoyage des ressources non utilisées..."
	docker system prune -f

# Arrête le service et nettoie tout
fclean: stop
	@echo "Suppression de l'image Docker..."
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