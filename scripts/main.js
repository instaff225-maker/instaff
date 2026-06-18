/**
 * ============================================================================
 * FICHIER : main.js
 * ENUMÉRATION : Modules d'interactions dynamiques
 * AGENCE : Code A-Z
 * DESCRIPTION : Gestion du filtrage asynchrone, visionneuse de chantiers 
 *               (Lightbox UX) et passerelle API WhatsApp Business.
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // Initialisation des modules globaux
    initGalleryFilters();
    initLightboxStudio();
    initWhatsAppGateway();

    /**
     * ========================================================================
     * MODULE 1 : FILTRAGE ASYNCHRONE DE LA GALERIE
     * Permet de trier les réalisations par catégorie sans rechargement de page.
     * ========================================================================
     */
    function initGalleryFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const galleryItems = document.querySelectorAll('.gallery-item');

        // Sécurité : On s'assure que les éléments existent sur la page actuelle
        if (!filterButtons.length || !galleryItems.length) return;

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                
                // 1. Mise à jour de l'état visuel des boutons (UI)
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // 2. Récupération du filtre sélectionné
                const filterValue = button.getAttribute('data-filter');

                // 3. Algorithme de tri avec micro-animations fluides
                galleryItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    
                    if (filterValue === 'all' || filterValue === itemCategory) {
                        // Affichage de l'élément
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        // Dissimulation de l'élément
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.9)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 400); // Aligné rigoureusement sur les timings CSS
                    }
                });
            });
        });
    }

    /**
     * ========================================================================
     * MODULE 2 : LIGHTBOX STUDIO INTERACTIVE
     * Génère une interface immersive plein écran pour contempler les détails.
     * ========================================================================
     */
    function initLightboxStudio() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        if (!galleryItems.length) return;

        // Injection dynamique de la structure DOM de la Lightbox
        const lightboxOverlay = document.createElement('div');
        lightboxOverlay.classList.add('lightbox-overlay');
        lightboxOverlay.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close" aria-label="Fermer la visionneuse">&times;</button>
                <img src="" alt="" class="lightbox-img">
                <div class="lightbox-caption"></div>
            </div>
        `;
        document.body.appendChild(lightboxOverlay);

        const lightboxImg = lightboxOverlay.querySelector('.lightbox-img');
        const lightboxCaption = lightboxOverlay.querySelector('.lightbox-caption');
        const lightboxClose = lightboxOverlay.querySelector('.lightbox-close');

        // Gestionnaire d'ouverture au clic sur une carte de la galerie
        galleryItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                const sourceImg = item.querySelector('img');
                const sourceTitle = item.querySelector('h3') ? item.querySelector('h3').innerText : '';
                
                if (sourceImg) {
                    lightboxImg.src = sourceImg.src;
                    lightboxImg.alt = sourceImg.alt;
                    lightboxCaption.innerText = sourceTitle;
                    
                    lightboxOverlay.classList.add('active');
                    document.body.style.overflow = 'hidden'; 
                }
            });
        });

        // Événements de fermeture
        lightboxClose.addEventListener('click', closeLightbox);
        
        lightboxOverlay.addEventListener('click', (e) => {
            if (e.target === lightboxOverlay) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightboxOverlay.classList.contains('active')) {
                closeLightbox();
            }
        });

        function closeLightbox() {
            lightboxOverlay.classList.remove('active');
            document.body.style.overflow = ''; 
        }
    }
/**
     * ========================================================================
     * MODULE 3 : PASSERELLE DE LEAD CONVERSION (WhatsApp Gateway)
     * Automatise la mise en forme des données du formulaire pour envoi direct.
     * ========================================================================
     */
    function initWhatsAppGateway() {
        const whatsappForm = document.getElementById('whatsappForm');
        if (!whatsappForm) return;

        whatsappForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // Extraction et assainissement des entrées utilisateur
            const dataNom = document.getElementById('nom').value.trim();
            const dataTel = document.getElementById('tel').value.trim();
            const dataService = document.getElementById('service').value;
            const dataSurface = document.getElementById('surface').value.trim();
            const dataMessage = document.getElementById('message').value.trim();

            // ✅ VALIDATION : Vérifier que les champs obligatoires ne sont pas vides
            if (!dataNom || dataNom.length < 3) {
                alert('❌ Veuillez entrer un nom valide (au moins 3 caractères)');
                return;
            }

            if (!dataMessage || dataMessage.length < 10) {
                alert('❌ Veuillez écrire un message plus détaillé (au moins 10 caractères)');
                return;
            }

            if (!dataService) {
                alert('❌ Veuillez sélectionner un type de prestation');
                return;
            }

            // ✅ VALIDATION : Vérifier que la surface (si renseignée) est un nombre valide
            if (dataSurface && isNaN(dataSurface)) {
                alert('❌ La surface doit être un nombre (ex: 50)');
                return;
            }

            // Identifiant WhatsApp de destination
            const targetPhoneNumber = "2250769398708";  // ← LE BON NUMÉRO MAINTENANT

            // Structuration sémantique du message
            let formattedText = `*⚙️ NOUVELLE DEMANDE DE DEVIS PLAFOND*\n`;
            formattedText += `------------------------------------------\n\n`;
            formattedText += `👤 *Client / Client PRO :* ${dataNom}\n`;
            formattedText += `📞 *Contat Client :* ${dataTel}\n`;
            formattedText += `📐 *Type de Prestation :* ${dataService}\n`;
            
            if (dataSurface) {
                formattedText += `📏 *Dimension estimative :* ${dataSurface} m²\n`;
            }
            
            formattedText += `\n💬 *Cahier des charges & Détails :*\n"${dataMessage}"\n\n`;
            formattedText += `------------------------------------------\n`;
            formattedText += `📡 _ Envoyé depuis le site instaffdeco.com _`;

            // Encodage strict et redirection
            const finalPayload = encodeURIComponent(formattedText);
            const apiEndpoint = `https://wa.me/${targetPhoneNumber}?text=${finalPayload}`;

            window.open(apiEndpoint, '_blank');
        });
    }
});


// Effet de scroll pour le header (ajout d'une classe CSS pour changement de style)
window.addEventListener('scroll', function() {
    const header = document.querySelector('.main-header');
    if (window.scrollY > 50) { // Si on descend de 50px
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});



// ============================================================================
// HAMBURGER MENU TOGGLE (Mobile)
// ============================================================================
document.addEventListener('DOMContentLoaded', function() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mainNav = document.getElementById('mainNav');

    if (hamburgerBtn && mainNav) {
        // Toggle le menu quand on clique le hamburger
        hamburgerBtn.addEventListener('click', function() {
            hamburgerBtn.classList.toggle('active');
            mainNav.classList.toggle('active');
        });

        // Fermer le menu quand on clique un lien de navigation
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburgerBtn.classList.remove('active');
                mainNav.classList.remove('active');
            });
        });

        // Fermer le menu quand on clique en dehors
        document.addEventListener('click', function(event) {
            const isClickInsideHeader = event.target.closest('.main-header');
            if (!isClickInsideHeader && mainNav.classList.contains('active')) {
                hamburgerBtn.classList.remove('active');
                mainNav.classList.remove('active');
            }
        });
    }
});