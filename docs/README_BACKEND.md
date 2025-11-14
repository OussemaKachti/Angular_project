# 🚀 Guide Complet : Backend Spring Boot + Intégration Angular

## 📚 Documentation Disponible

Ce projet contient deux guides complets pour créer un backend Spring Boot et l'intégrer avec votre application Angular :

### 1. **GUIDE_BACKEND_SPRING_BOOT.md**
   - Création du projet Spring Boot
   - Configuration de la base de données (MySQL/PostgreSQL)
   - Création des entités JPA
   - Implémentation des repositories, services et controllers REST
   - Configuration CORS
   - Tests du backend

### 2. **GUIDE_INTEGRATION_ANGULAR.md**
   - Modification du DataService pour utiliser HttpClient
   - Création des fichiers d'environnement
   - Mise à jour des composants Angular
   - Tests de l'intégration complète

---

## 🎯 Par Où Commencer ?

### Étape 1 : Créer le Backend (Nouveau Projet)
1. Suivez **GUIDE_BACKEND_SPRING_BOOT.md** étape par étape
2. Créez un **nouveau projet Spring Boot** (séparé de votre projet Angular)
3. Configurez la base de données
4. Implémentez toutes les entités et services
5. Testez avec Postman ou cURL

### Étape 2 : Intégrer avec Angular
1. Une fois le backend fonctionnel, suivez **GUIDE_INTEGRATION_ANGULAR.md**
2. Modifiez votre projet Angular existant
3. Remplacez les services locaux par des appels HTTP
4. Testez l'intégration complète

---

## 📋 Structure du Backend à Créer

```
events-backend/
├── src/
│   ├── main/
│   │   ├── java/com/events/backend/
│   │   │   ├── entity/
│   │   │   │   ├── Address.java
│   │   │   │   └── Event.java
│   │   │   ├── repository/
│   │   │   │   └── EventRepository.java
│   │   │   ├── service/
│   │   │   │   └── EventService.java
│   │   │   ├── controller/
│   │   │   │   └── EventController.java
│   │   │   └── config/
│   │   │       └── CorsConfig.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
└── pom.xml
```

---

## 🔗 Endpoints API Disponibles

Une fois le backend créé, vous aurez ces endpoints :

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/events` | Récupérer tous les événements |
| GET | `/api/events/{id}` | Récupérer un événement par ID |
| POST | `/api/events` | Créer un nouvel événement |
| PUT | `/api/events/{id}` | Mettre à jour un événement |
| DELETE | `/api/events/{id}` | Supprimer un événement |
| GET | `/api/events/search?q={term}` | Rechercher des événements |
| POST | `/api/events/{id}/like` | Incrémenter les likes |
| POST | `/api/events/{id}/buy` | Acheter un ticket |

---

## 🗄️ Modèle de Données

### Event
- `id` (Long, auto-généré)
- `titre` (String, requis)
- `description` (String, requis)
- `date` (LocalDateTime, requis)
- `lieu` (String, requis)
- `prix` (Double, requis)
- `organisateurId` (Long, requis)
- `imageUrl` (String, requis)
- `nbPlaces` (Integer, requis)
- `nbrLikes` (Integer, défaut: 0)
- `domaines` (List<String>, optionnel)
- `detailedAddress` (Address, optionnel)

### Address (Embedded)
- `street` (String)
- `city` (String)
- `governorate` (String)
- `zipcode` (String)

---

## ⚙️ Prérequis

### Pour le Backend
- Java 17 ou 21
- Maven 3.6+
- MySQL 8.0+ ou PostgreSQL 12+
- IDE (IntelliJ IDEA, Eclipse, ou VS Code)

### Pour l'Intégration
- Node.js 18+
- Angular CLI
- Backend Spring Boot fonctionnel

---

## 🚦 Workflow Recommandé

1. **Phase 1 : Backend** (Nouveau projet)
   - [ ] Créer le projet Spring Boot
   - [ ] Configurer la base de données
   - [ ] Créer les entités
   - [ ] Créer les repositories
   - [ ] Créer les services
   - [ ] Créer les controllers
   - [ ] Tester avec Postman

2. **Phase 2 : Intégration** (Projet Angular existant)
   - [ ] Installer/Configurer HttpClient
   - [ ] Créer les fichiers d'environnement
   - [ ] Modifier DataService
   - [ ] Modifier les composants
   - [ ] Tester l'intégration

3. **Phase 3 : Tests Finaux**
   - [ ] Tester toutes les fonctionnalités
   - [ ] Vérifier la persistance en base
   - [ ] Vérifier les erreurs et la gestion d'erreurs

---

## 📝 Notes Importantes

1. **Projets Séparés** : Le backend et le frontend sont dans des projets séparés
2. **Ports** : 
   - Backend : `http://localhost:8080`
   - Frontend : `http://localhost:4200`
3. **CORS** : Assurez-vous que CORS est bien configuré pour permettre les requêtes depuis Angular
4. **Base de Données** : La base de données sera créée automatiquement au premier démarrage (si `ddl-auto=update`)

---

## 🆘 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs du backend (console)
2. Vérifiez les logs du navigateur (F12)
3. Vérifiez que la base de données est accessible
4. Vérifiez que les ports ne sont pas déjà utilisés

---

## ✅ Objectif Final

À la fin de ce processus, vous aurez :
- ✅ Un backend Spring Boot complet avec base de données
- ✅ Une API REST fonctionnelle
- ✅ Une application Angular connectée au backend
- ✅ Toutes les données persistées en base de données
- ✅ Une architecture complète et professionnelle

**Bon courage ! 🎉**

