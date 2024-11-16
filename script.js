const members = JSON.parse(localStorage.getItem('members')) || [];
const categories = JSON.parse(localStorage.getItem('categories')) || [];

document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        const targetTab = this.dataset.tab;
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        document.getElementById(targetTab).classList.add('active');
        window.location.hash = targetTab;
    });
});

window.addEventListener('hashchange', function() {
    const hash = window.location.hash.substring(1);
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    if (hash) {
        document.getElementById(hash).classList.add('active');
    } else {
        document.getElementById('leaderboard').classList.add('active');
    }
});

function registerMember(name) {
    const member = {
        name: name,
        totalPoints: 0,
        badge: 'BRONZE'
    };
    members.push(member);
    localStorage.setItem('members', JSON.stringify(members));
    updateLeaderboard();
    updateMemberDropdown();
}

function associateCategoryToMember(memberName, categoryName) {
    const member = members.find(m => m.name === memberName);
    const category = categories.find(c => c.name === categoryName);
    if (member && category) {
        member.totalPoints += parseInt(category.points, 10);
        member.badge = calculateBadge(member.totalPoints);
        localStorage.setItem('members', JSON.stringify(members));
        updateLeaderboard();
    }
}

function calculateBadge(totalPoints) {
    if (totalPoints >= 100) {
        return 'GOLD';
    } else if (totalPoints >= 50) {
        return 'SILVER';
    } else {
        return 'BRONZE';
    }
}

function updateLeaderboard() {
    const leaderboardBody = document.getElementById('leaderboard-body');
    leaderboardBody.innerHTML = '';
    const sortedMembers = [...members].sort((a, b) => b.totalPoints - a.totalPoints);
    sortedMembers.forEach(member => {
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        const pointsCell = document.createElement('td');
        const badgeCell = document.createElement('td');
        const actionsCell = document.createElement('td');

        nameCell.textContent = member.name;
        pointsCell.textContent = member.totalPoints;
        badgeCell.textContent = member.badge;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            deleteMember(member.name);
        });

        actionsCell.appendChild(deleteButton);

        row.appendChild(nameCell);
        row.appendChild(pointsCell);
        row.appendChild(badgeCell);
        row.appendChild(actionsCell);
        leaderboardBody.appendChild(row);
    });
}

function addCategory(name, points) {
    const category = { name: name, points: parseInt(points, 10) };
    categories.push(category);
    localStorage.setItem('categories', JSON.stringify(categories));
    updateCategoriesList();
    updateCategoryDropdown();
}

function updateCategoriesList() {
    const categoriesList = document.getElementById('categories-list');
    if (categoriesList) {
        categoriesList.innerHTML = '';
        categories.forEach(category => {
            const li = document.createElement('li');
            li.textContent = `${category.name} - ${category.points} points`;

            const disassociateButton = document.createElement('button');
            disassociateButton.textContent = 'Disassociate';
            disassociateButton.addEventListener('click', () => {
                disassociateCategory(category.name);
            });

            li.appendChild(disassociateButton);
            categoriesList.appendChild(li);
        });
    }
}

function updateMemberDropdown() {
    const memberDropdown = document.getElementById('assign-member-name');
    if (memberDropdown) {
        memberDropdown.innerHTML = '';
        members.forEach(member => {
            const option = document.createElement('option');
            option.value = member.name;
            option.textContent = member.name;
            memberDropdown.appendChild(option);
        });
    }
}

function updateCategoryDropdown() {
    const categoryDropdown = document.getElementById('assign-category-name');
    if (categoryDropdown) {
        categoryDropdown.innerHTML = '';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.name;
            option.textContent = category.name;
            categoryDropdown.appendChild(option);
        });
    }
}

function deleteMember(name) {
    const index = members.findIndex(m => m.name === name);
    if (index !== -1) {
        members.splice(index, 1);
        localStorage.setItem('members', JSON.stringify(members));
        updateLeaderboard();
        updateMemberDropdown();
    }
}

function disassociateCategory(name) {
    const index = categories.findIndex(c => c.name === name);
    if (index !== -1) {
        categories.splice(index, 1);
        localStorage.setItem('categories', JSON.stringify(categories));
        updateCategoriesList();
        updateCategoryDropdown();
    }
}

document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const memberName = document.getElementById('member-name').value;
    registerMember(memberName);
    document.getElementById('register-form').reset();
});

document.getElementById('category-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const categoryName = document.getElementById('category-name').value;
    const categoryPoints = parseInt(document.getElementById('category-points').value, 10);
    addCategory(categoryName, categoryPoints);
    document.getElementById('category-form').reset();
});

document.getElementById('assign-category-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const memberName = document.getElementById('assign-member-name').value;
    const categoryName = document.getElementById('assign-category-name').value;
    associateCategoryToMember(memberName, categoryName);
    document.getElementById('assign-category-form').reset();
});

// Initialize the leaderboard and categories list on page load
document.addEventListener('DOMContentLoaded', () => {
    updateLeaderboard();
    updateCategoriesList();
    updateMemberDropdown();
    updateCategoryDropdown();
    const hash = window.location.hash.substring(1);
    if (hash) {
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        document.getElementById(hash).classList.add('active');
    }
});
