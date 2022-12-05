export default class AboutList {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async init() {
        const id  = localStorage.getItem('author');
        const list = await this.dataSource.getOwnersData(id);
        console.log(list)

        const template = document.querySelector('.about-collection')
        template.append(this.artPieceTemplate(list))
        
    }

    artPieceTemplate(element) {
        let aboutSection = document.createElement('div');
        let aboutPerson = document.createElement('h1');
        let aboutProfile = document.createElement('img');
        let aboutInfo = document.createElement('p');
        aboutSection.className = "about";
        aboutPerson.textContent = element.firstN + element.lastN;
        aboutProfile.src = element.profileImg;
        aboutInfo.textContent = element.aboutMe;

        aboutSection.appendChild(aboutPerson)
        aboutSection.appendChild(aboutProfile)
        aboutSection.appendChild(aboutInfo)

        return aboutSection;
    }

}