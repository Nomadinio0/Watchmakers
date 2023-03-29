const footerYear = document.querySelector('.footer__year')
const mobileNav = document.querySelector('.navbar__items')
const burgerTransform = document.querySelector('.burgerBtn')

burgerTransform.addEventListener('click', function(){
	mobileNav.classList.toggle('navbar__items-active');
})

const handleCurrentYear = () => {
	const year = new Date().getFullYear()
	footerYear.innerText = year
}

handleCurrentYear()