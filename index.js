const GALLERY_ID = 'gallery';
const TRANSITION_SPEED = 0.1;

const CUSTOM_IMAGES = [
    'https://images.unsplash.com/photo-1486411894105-9ad5867702e6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1585937250791-efc81fc76e43?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1531003914465-d6c6673bc635?q=80&w=1034&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://plus.unsplash.com/premium_photo-1661838163543-256611b22718?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1669205431929-c5ea2973dec8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1526141394867-35f881581ec2?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
];

class FloatingImage {
    constructor(containerWidth, containerHeight, imageUrl, gallery) {
        this.containerWidth = containerWidth;
        this.containerHeight = containerHeight;
        this.imageUrl = imageUrl;
        this.gallery = gallery;
        this.element = this.createImageElement();
        this.setDimensions();
        this.setInitialPosition();
        this.isActive = false;
        this.isTransitioning = false;
    }

    // Creates the image element and sets up the click event
    createImageElement() {
        const img = document.createElement('div');
        img.className = 'image';
        img.style.backgroundImage = `url('${this.imageUrl}')`;
        img.addEventListener('click', () => this.gallery.activateImage(this));
        return img;
    }

    // Sets the initial position of the image
    setInitialPosition() {
        this.x = Math.random() * (this.containerWidth - this.width);
        this.y = Math.random() * (this.containerHeight - this.height);
        this.originalX = this.x;
        this.originalY = this.y;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.updatePosition();
    }

    // Sets the dimensions of the image based on the container size
    setDimensions() {
        const dimensions = this.calculateDimensions();
        this.width = dimensions.width;
        this.height = dimensions.height;
        this.activeWidth = dimensions.activeWidth;
        this.activeHeight = dimensions.activeHeight;
        this.element.style.width = `${this.width}px`;
        this.element.style.height = `${this.height}px`;
    }

    // Calculates the dimensions of the image based on the container size
    calculateDimensions() {
        if (this.containerWidth <= 480) {
            return { width: 80, height: 60, activeWidth: 160, activeHeight: 120 };
        } else if (this.containerWidth <= 768) {
            return { width: 100, height: 75, activeWidth: 200, activeHeight: 150 };
        } else {
            return { width: 150, height: 100, activeWidth: 300, activeHeight: 200 };
        }
    }

    // Updates the image's position and state
    update() {
        if (this.isActive || this.isTransitioning) {
            this.handleActiveState();
        } else {
            this.move();
        }
        this.updatePosition();
    }

    // Handles the active state of the image
    handleActiveState() {
        if (this.isTransitioning) {
            const dx = this.targetX - this.x;
            const dy = this.targetY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 1) {
                this.x = this.targetX;
                this.y = this.targetY;
                this.isTransitioning = false;
            } else {
                this.x += dx * TRANSITION_SPEED;
                this.y += dy * TRANSITION_SPEED;
            }
        }
    }

    // Moves the image
    move() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.handleBoundaries();
        this.originalX = this.x;
        this.originalY = this.y;
    }

    // Handles the boundaries of the container
    handleBoundaries() {
        if (this.x <= 0 || this.x >= this.containerWidth - this.width) {
            this.speedX *= -1;
            this.x = Math.max(0, Math.min(this.x, this.containerWidth - this.width));
        }
        if (this.y <= 0 || this.y >= this.containerHeight - this.height) {
            this.speedY *= -1;
            this.y = Math.max(0, Math.min(this.y, this.containerHeight - this.height));
        }
    }

    // Updates the position of the image element
    updatePosition() {
        this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
    }

    // Activates the image
    activate() {
        this.isActive = true;
        this.element.classList.add('active');
        this.element.style.width = `${this.activeWidth}px`;
        this.element.style.height = `${this.activeHeight}px`;
        this.targetX = this.calculateTargetX();
        this.targetY = this.calculateTargetY();
        this.isTransitioning = true;
    }

    // Deactivates the image
    deactivate() {
        this.isActive = false;
        this.element.classList.remove('active');
        this.element.style.width = `${this.width}px`;
        this.element.style.height = `${this.height}px`;
        this.targetX = this.originalX;
        this.targetY = this.originalY;
        this.isTransitioning = true;
    }

    // Calculates the target X position for the active state
    calculateTargetX() {
        return Math.max(0, Math.min(this.containerWidth / 2 - this.activeWidth / 2, this.containerWidth - this.activeWidth));
    }

    // Calculates the target Y position for the active state
    calculateTargetY() {
        return Math.max(0, Math.min(this.containerHeight / 2 - this.activeHeight / 2, this.containerHeight - this.activeHeight));
    }

    // Resizes the image based on new container dimensions
    resize(containerWidth, containerHeight) {
        this.containerWidth = containerWidth;
        this.containerHeight = containerHeight;
        this.setDimensions();
        if (!this.isActive) {
            this.x = Math.min(this.x, this.containerWidth - this.width);
            this.y = Math.min(this.y, this.containerHeight - this.height);
            this.originalX = this.x;
            this.originalY = this.y;
        } else {
            this.targetX = this.calculateTargetX();
            this.targetY = this.calculateTargetY();
            this.isTransitioning = true;
        }
        this.updatePosition();
    }
}

class Gallery {
    constructor(containerId, images) {
        this.container = document.getElementById(containerId);
        this.images = [];
        this.activeImage = null;
        this.init(images);
    }

    // Initializes the gallery
    init(images) {
        setTimeout(() => {
            const containerWidth = this.container.offsetWidth;
            const containerHeight = this.container.offsetHeight;
            images.forEach(imageUrl => {
                const image = new FloatingImage(containerWidth, containerHeight, imageUrl, this);
                this.container.appendChild(image.element);
                this.images.push(image);
            });
            this.addEventListeners();
            this.animate();
        }, 0);
    }

    // Activates the selected image
    activateImage(image) {
        if (this.activeImage && this.activeImage !== image) {
            this.activeImage.deactivate();
        }
        if (this.activeImage !== image) {
            image.activate();
            this.activeImage = image;
        } else {
            this.activeImage = null;
        }
    }

    // Adds event listeners for resize and click events
    addEventListeners() {
        window.addEventListener('resize', () => this.handleResize());
        document.addEventListener('click', (e) => this.handleDocumentClick(e));
    }

    // Handles the resize event
    handleResize() {
        const containerWidth = this.container.offsetWidth;
        const containerHeight = this.container.offsetHeight;
        this.images.forEach(img => img.resize(containerWidth, containerHeight));
    }

    // Handles clicks outside of the active image
    handleDocumentClick(e) {
        if (this.activeImage && !this.activeImage.element.contains(e.target)) {
            this.activeImage.deactivate();
            this.activeImage = null;
        }
    }

    // Animates the gallery
    animate() {
        this.images.forEach(img => img.update());
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize the gallery when the window loads
window.addEventListener('load', () => {
    new Gallery(GALLERY_ID, CUSTOM_IMAGES);
});