class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        this.markedDays = new Set(); // Store marked days as strings (YYYY-MM-DD)
        this.projects = [];
        this.initialize();
    }

    initialize() {
        this.updateCalendar();
        
        // Set up project management
        const addProjectButton = document.getElementById('add-project');
        addProjectButton.addEventListener('click', () => this.showAddProjectModal());
        
        // Set up month navigation
        document.getElementById('prev-month').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.updateCalendar();
        });

        document.getElementById('next-month').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.updateCalendar();
        });
    }

    updateCalendar() {
        const daysContainer = document.getElementById('calendar-days');
        const monthYear = document.getElementById('month-year');
        
        // Clear existing days
        daysContainer.innerHTML = '';
        
        // Update month and year
        monthYear.textContent = `${this.monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
        
        // Get first day of the month and total days
        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        const totalDays = lastDay.getDate();
        const startDay = firstDay.getDay();
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startDay; i++) {
            const emptyCell = document.createElement('div');
            daysContainer.appendChild(emptyCell);
        }
        
        // Add days of the month
        for (let day = 1; day <= totalDays; day++) {
            const dayElement = document.createElement('div');
            dayElement.textContent = day;
            
            // Create a date string for this day
            const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
            const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format
            
            // Check if this day is marked
            if (this.markedDays.has(dateStr)) {
                dayElement.classList.add('marked');
            }
            
            // Highlight today's date
            const today = new Date();
            if (day === today.getDate() && 
                this.currentDate.getMonth() === today.getMonth() && 
                this.currentDate.getFullYear() === today.getFullYear()) {
                dayElement.classList.add('today');
            }
            
            // Add click event to toggle marking
            dayElement.addEventListener('click', () => {
                if (this.markedDays.has(dateStr)) {
                    this.markedDays.delete(dateStr);
                    dayElement.classList.remove('marked');
                } else {
                    this.markedDays.add(dateStr);
                    dayElement.classList.add('marked');
                }
            });
            
            daysContainer.appendChild(dayElement);
        }
    }

    // Project management methods
    showAddProjectModal() {
        const modal = document.createElement('div');
        modal.className = 'new-project-modal';
        modal.innerHTML = `
            <div class="new-project-form">
                <h2>Add New Project</h2>
                <input type="text" id="project-name" placeholder="Project Name" required>
                <input type="number" id="project-duration" placeholder="Duration (days)" required min="1">
                <button id="create-project">Create Project</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.classList.add('active');

        const createButton = modal.querySelector('#create-project');
        createButton.addEventListener('click', () => {
            const name = document.getElementById('project-name').value;
            const duration = parseInt(document.getElementById('project-duration').value);
            
            if (name && duration > 0) {
                this.addProject(name, duration);
                modal.remove();
            }
        });

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    addProject(name, duration) {
        const project = {
            id: Date.now(),
            name: name,
            duration: duration,
            startDate: new Date(),
            endDate: new Date(new Date().getTime() + (duration * 24 * 60 * 60 * 1000))
        };
        
        this.projects.push(project);
        this.updateProjectsList();
    }

    updateProjectsList() {
        const projectsList = document.getElementById('projects-list');
        projectsList.innerHTML = '';
        
        this.projects.forEach(project => {
            const projectItem = document.createElement('div');
            projectItem.className = 'project-item';
            projectItem.innerHTML = `
                <div class="project-name">${project.name}</div>
                <div class="project-duration">${project.duration} days</div>
            `;
            projectsList.appendChild(projectItem);
        });
    }
}

// Initialize calendar when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new Calendar();
});
