/* *******************************************************
 * filename : main.js
 * description : 메인에만 사용되는 JS
 * date : 2023-04-26
******************************************************** */

// menu 이동함수
function goToScroll(name) {
    var location = document.querySelector("#" + name).offsetTop;
    window.scrollTo({top: location, behavior: 'smooth'});
}

(() => {
    let yOffset = 0;
    let prevScrollHeight = 0;
    let curSection = 0; 
    let enterNewScene = false; // 새로운 section이 시작된 순간 true

    const sectionInfo = [
        {   // section01
            type:'sticky',
            heightNum : 3,
            scrollHeight:0,
            objs:{
                container: document.querySelector('#mainSection01'),
                visual_title : document.querySelector('#mainSection01 .main-visual-tit-box'),
                title01 : document.querySelector('#mainSection01 .tit01'),
                title02 : document.querySelector('#mainSection01 .tit02'),
                title03 : document.querySelector('#mainSection01 .tit03'),

                // Section02 미리 불러오기
                sectionTitle : document.querySelector('#mainSection02 .main-section-tit'),
                aboutImg : document.querySelector('#mainSection02 .img-box'),
                aboutTxt : document.querySelector('#mainSection02 .txt-box'),
            },
            values:{
                title01_opacity_on : [0, 1, { start: 0.1, end: 0.2 }],
                title01_opacity_off: [1, 0, { start: 0.25, end: 0.3 }],

                title02_opacity_on : [0, 1, { start: 0.3, end: 0.4 }],
                title02_opacity_off: [1, 0, { start: 0.45, end: 0.5 }],

                title03_opacity_on : [0, 1, { start: 0.5, end: 0.6 }],
                title03_opacity_off: [1, 0, { start: 1, end: 1 }],

                title01_translateY_on: [5, 0, { start: 0, end: 0.2 }],
                title01_translateY_off: [0, -5, { start: 0.25, end: 0.3 }],

                title02_translateY_on: [5, 0, { start: 0.3, end: 0.4 }],
				title02_translateY_off: [0, -5, { start: 0.45, end: 0.5 }],
                
                title03_translateY_on: [5, 0, { start: 0.5, end: 0.6 }],
				title03_translateY_off: [0, -5, { start: 1, end: 1 }],

                visual_title_opacity_on : [0, 1, {start:0, end:0.2}],
                visual_title_opacity_off : [1, 0, {start:0.1, end:0.2}],

                // Section02 미리 불러오기
                sectionTitle_opacity_on : [0, 1, { start: 0.8, end: 1 }],
                sectionTitle_opacity_off: [1, 0, { start: 1, end: 1 }],
                sectionTitle_translateY_on: [100, 0, { start: 0.8, end: 1 }],
				sectionTitle_translateY_off: [0, -100, { start: 1, end: 1 }],

                aboutImg_opacity_on : [0, 1, { start: 0.8, end: 1 }],
                aboutImg_opacity_off: [1, 0, { start: 1, end: 1 }],
                aboutImg_translateY_on: [20, 0, { start: 0.8, end: 1 }],
				aboutImg_translateY_off: [0, -20, { start: 1, end: 1 }],

                aboutTxt_opacity_on : [0, 1, { start: 0.8, end: 1 }],
                aboutTxt_opacity_off: [1, 0, { start: 1, end: 1 }],
                aboutTxt_translateY_on: [20, 0, { start: 0.8, end: 1 }],
				aboutTxt_translateY_off: [0, -20, { start: 1, end: 1 }],

            },
        },
        {   //section02
            type:'normal',
            scrollHeight:0,
            objs:{
                container: document.querySelector('#mainSection02'),
                // Section03 미리 불러오기
                sectionTitle : document.querySelector('#mainSection03 .tit-box'),
                portfolioItem : document.querySelector('#mainSection03 .main-portfolio-list'),
            },
            values:{
                // Section03 미리 불러오기
                sectionTitle_opacity_on : [0, 1, { start: 0.7, end: 1 }],
                sectionTitle_opacity_off: [1, 0, { start: 1, end: 0.7 }],
                sectionTitle_translateY_on: [20, 0, { start: 0.7, end: 1 }],
				sectionTitle_translateY_off: [0, -20, { start: 1, end: 1 }],
            },
        },
        {   //section03
            type:'normal',
            scrollHeight:0,
            objs:{
                container: document.querySelector('#mainSection03'),
                portfolioItem : document.querySelector('#mainSection03 .main-portfolio-list'),
                // Section04 미리 불러오기
                contactBg : document.querySelector('#mainSection04 .bg'),
                contactTit : document.querySelector('#mainSection04 .tit-box'),
                contactTxt : document.querySelector('#mainSection04 .btn-box'),
            },
            values:{
                portfolioItem_opacity_on : [0, 1, { start: 0, end: 0.1 }],
                portfolioItem_opacity_off: [1, 0, { start: 0, end: 0.1 }],
                portfolioItem_translateY_on: [20, 0, { start: 0, end: 0.1 }],
				portfolioItem_translateY_off: [0, -20, { start: 0, end: 0.1 }],
                // Section04 미리 불러오기
                contactBg_translateX_on: [100, 0, { start: 0.8, end: 1 }],
                contactBg_translateX_off: [0, -20, { start: 0.8, end: 1 }],

                contactTit_opacity_on : [0, 1, { start: 0.8, end: 1}],
                contactTit_translateY_on: [10, 0, { start: 0, end: 0.2 }],

                contactTxt_opacity_on : [0, 1, { start: 0.9, end: 1 }],
                contactTxt_translateY_on: [10, 0, { start: 0.1, end: 0.2 }],

            },
        },
        {   //section04
            type:'normal',
            scrollHeight:0,
            //heightNum : 2,
            objs:{
                container: document.querySelector('#mainSection04'),
            },
            values:{
                
            }
        },
    ];

    function calcValues(values, currentYOffset) { 
        let scrollVal;
        const scrollHeight = sectionInfo[curSection].scrollHeight;
        const scrollRatio = currentYOffset / scrollHeight;

        if (values.length === 3){ // scrollstart, end 값이 있을때
            const partScrollStart = values[2].start * scrollHeight;
            const partScrollEnd = values[2].end * scrollHeight;
            const partScrollHeight = partScrollEnd - partScrollStart;

            if (currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd){
                scrollVal = (currentYOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0];
            } else if ( currentYOffset < partScrollStart) {
                scrollVal = values[0]; 
            } else if (currentYOffset > partScrollEnd) {
                scrollVal = values[1];
            }
        }else {
            scrollVal = scrollRatio * (values[1] - values[0]) + values[0];
        }
        return scrollVal;
    }
    
    function playAnimation() {
        const objs = sectionInfo[curSection].objs;
        const values = sectionInfo[curSection].values;
        const currentYOffset = yOffset - prevScrollHeight;
        const scrollHeight = sectionInfo[curSection].scrollHeight;
        const scrollRatio = currentYOffset / scrollHeight;
        console.log(curSection, scrollRatio);
        switch (curSection){
            case 0 : // seciton01
                if(scrollRatio <= 0.22){
                    objs.title01.style.opacity = calcValues(values.title01_opacity_on, currentYOffset);
                    objs.title01.style.transform = `translate3d(0, ${calcValues(values.title01_translateY_on, currentYOffset)}%, 0)`;

                    objs.visual_title.style.opacity = calcValues(values.visual_title_opacity_off, currentYOffset);
                }else {
                    //off
                    objs.title01.style.opacity = calcValues(values.title01_opacity_off, currentYOffset);
                    objs.title01.style.transform = `translate3d(0, ${calcValues(values.title01_translateY_off, currentYOffset)}%, 0)`;
                }

                if(scrollRatio <= 0.42){
                    objs.title02.style.opacity = calcValues(values.title02_opacity_on,currentYOffset);
                    objs.title02.style.transform = `translate3d(0, ${calcValues(values.title02_translateY_on, currentYOffset)}%, 0)`;

                }else {
                    //off
                    objs.title02.style.opacity = calcValues(values.title02_opacity_off, currentYOffset);
                    objs.title02.style.transform = `translate3d(0, ${calcValues(values.title02_translateY_off, currentYOffset)}%, 0)`;
                }

                if(scrollRatio <= 0.62){
                    objs.title03.style.opacity = calcValues(values.title03_opacity_on,currentYOffset);
                    objs.title03.style.transform = `translate3d(0, ${calcValues(values.title03_translateY_on, currentYOffset)}%, 0)`;

                }else {
                    //off
                    objs.title03.style.opacity = calcValues(values.title03_opacity_off, currentYOffset);
                    objs.title03.style.transform = `translate3d(0, ${calcValues(values.title03_translateY_off, currentYOffset)}%, 0)`;
                }

                // Section02 미리 불러오기
                if(scrollRatio >= 0.7){
                    objs.sectionTitle.style.opacity = calcValues(values.sectionTitle_opacity_on, currentYOffset);
                    objs.sectionTitle.style.transform = `translate3d(0, ${calcValues(values.sectionTitle_translateY_on, currentYOffset)}%, 0)`;

                    objs.aboutImg.style.opacity = calcValues(values.aboutImg_opacity_on, currentYOffset);
                    objs.aboutImg.style.transform = `translate3d( -${calcValues(values.aboutImg_translateY_on, currentYOffset)}%, 0,  0)`;

                    objs.aboutTxt.style.opacity = calcValues(values.aboutTxt_opacity_on, currentYOffset);
                    objs.aboutTxt.style.transform = `translate3d( ${calcValues(values.aboutTxt_translateY_on, currentYOffset)}%, 0,  0)`;
                }

                break;
            case 1 :
                // Section03 미리 불러오기
                if(scrollRatio >= 0.7){
                    objs.sectionTitle.style.opacity = calcValues(values.sectionTitle_opacity_on, currentYOffset);
                    objs.sectionTitle.style.transform = `translate3d(0, ${calcValues(values.sectionTitle_translateY_on, currentYOffset)}%, 0)`;
                    objs.portfolioItem.style.opacity = 0;
                }else{
                    objs.sectionTitle.style.opacity = 0;
                }
                break;
            case 2 :
                if(scrollRatio >= 0){
                    objs.portfolioItem.style.opacity = calcValues(values.portfolioItem_opacity_on, currentYOffset);
                    objs.portfolioItem.style.transform = `translate3d(0, ${calcValues(values.portfolioItem_translateY_on, currentYOffset)}%, 0)`;
                }
                //Section04 미리 불러오기
                if(scrollRatio >= 0.7) {
                    objs.contactBg.style.transform = `translate3d( -${calcValues(values.contactBg_translateX_on, currentYOffset)}%,0, 0)`;
                    objs.contactTit.style.opacity = calcValues(values.contactTit_opacity_on, currentYOffset);
                    objs.contactTit.style.transform = `translate3d(0, ${calcValues(values.contactTit_translateY_on, currentYOffset)}%, 0)`;
                    objs.contactTxt.style.opacity = calcValues(values.contactTxt_opacity_on, currentYOffset);
                    objs.contactTxt.style.transform = `translate3d(0, ${calcValues(values.contactTxt_translateY_on, currentYOffset)}%, 0)`;
                }else{
                    objs.contactBg.style.transform = `translate3d(-100% ,0, 0)`;
                    objs.contactTit.style.opacity = 0;
                    objs.contactTxt.style.opacity = 0;
                }
                break;
        }
    }

    function scrollLoop(){
        enterNewScene = false;
        prevScrollHeight = 0;

        for(let i = 0; i < curSection; i++){
            prevScrollHeight += sectionInfo[i].scrollHeight;
        }

        if(yOffset > prevScrollHeight + sectionInfo[curSection].scrollHeight){
            enterNewScene = true;
            curSection++;
            document.body.setAttribute('id',`curSection${curSection + 1}`);
        }

        if(yOffset < prevScrollHeight) {
            enterNewScene = true;
            if(curSection === 0) return;
            curSection--;
            document.body.setAttribute('id',`curSection${curSection + 1}`);
        }
        
        if(enterNewScene) return;
        playAnimation();
    }

    function setLayout() {
        for (let i = 0; i < sectionInfo.length; i++){
            if (sectionInfo[i].type == "sticky") {
                sectionInfo[i].scrollHeight = sectionInfo[i].heightNum * window.innerHeight;
            }else if(sectionInfo[i].type == "normal"){
                sectionInfo[i].scrollHeight = sectionInfo[i].objs.container.offsetHeight ;//+ window.innerHeight * 0.5;
            }
            sectionInfo[i].objs.container.style.height = `${sectionInfo[i].scrollHeight}px`;
        }

        yOffset = window.pageYOffset;

        let totalScrollHeight = 0;
        for(let i = 0; i < sectionInfo.length; i++){
            totalScrollHeight += sectionInfo[i].scrollHeight;
            if(totalScrollHeight >= yOffset){
                curSection = i;
                break;
            }
        }
        document.body.setAttribute('id',`curSection${curSection+1}`);
    }

    
    window.addEventListener('load',() =>{
        setLayout();
        // 중간에서 새로고침 했을 경우 자동 스크롤로 제대로 그려주기
        let tempYOffset = yOffset;
        let tempScrollCount = 0;
        if (tempYOffset > 0) {
            let siId = setInterval(() => {
                scrollTo(0, tempYOffset);
                tempYOffset += 5;

                if (tempScrollCount > 20) {
                    clearInterval(siId);
                }
                tempScrollCount++;
            }, 20);
        }

        window.addEventListener('scroll', () =>{
            yOffset = window.pageYOffset;
            scrollLoop();

            // 모바일에서 header fixed
            if (window.innerWidth <= 800 ) {
                if(yOffset > 0 ){
                    document.querySelector("#header").classList.add("top-fixed");
                }else{
                    document.querySelector("#header").classList.remove("top-fixed");
                }
            }
        })

        window.addEventListener('resize',()=>{
            //if (window.innerWidth > 900) {
				window.location.reload();
			//}
        });

        window.addEventListener('orientationchange', () => {
			scrollTo(0, 0);
			setTimeout(() => {
				window.location.reload();
			}, 500);
  		});
    }); 

}) ();