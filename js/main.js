/* *******************************************************
 * filename : main.js
 * description : 메인에만 사용되는 JS
 * date : 2022-08-08
******************************************************** */

(() => {
    let yOffset = 0;
    let prevScrollHeight = 0;
    let curSection = 0; 
    let enterNewScene = false; // 새로운 section이 시작된 순간 true
	let acc = 0.2;
	let delayedYOffset = 0;
	let rafId;
	let rafState;

    function textActiveFunc() {
        
    }

    const sectionInfo = [
        {
            type:'sticky',
            heightNum : 3,
            scrollHeight:0,
            objs:{
                container: document.querySelector('#mainSection01'),
                visual_title : document.querySelector('#mainSection01 .main-visual-tit-box'),
                title01 : document.querySelector('#mainSection01 .tit01'),
                title02 : document.querySelector('#mainSection01 .tit02'),
                title03 : document.querySelector('#mainSection01 .tit03'),
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
            },
        },
        {
            type:'normal',
            scrollHeight:0,
            objs:{
                container: document.querySelector('#mainSection02'),
                
            }
        },
        {
            type:'normal',
            scrollHeight:0,
            objs:{
                container: document.querySelector('#mainSection03'),
                bg : document.querySelector("#mainSection04 .bg"),
                title01 : document.querySelector('#mainSection04 .tit'),
                title02 : document.querySelector('#mainSection04 .btn-box'),
            },
            values:{
                bg_translateX_on : [0, 100, {start:0.4, end:0.5}],
                bg_translateX_off : [100, 0, {start:0.5, end:0.6}],

                title01_opacity_on : [0, 1, { start: 0.4, end: 0.5 }],
                title01_opacity_off: [1, 0, { start: 0.5, end: 0 }],

                title02_opacity_on : [0, 1, { start: 0.3, end: 0.4 }],
                title02_opacity_off: [1, 0, { start: 0.45, end: 0.5 }],

                title01_translateY_on: [5, 0, { start: 0.4, end: 0.5 }],
                title01_translateY_off: [0, -5, { start: 0.5, end: 0.6 }],

                title02_translateY_on: [5, 0, { start: 0.3, end: 0.4 }],
				title02_translateY_off: [0, -5, { start: 0.45, end: 0.5 }],
            }
        },
        {
            type:'normal',
            scrollHeight:0,
            objs:{
                container: document.querySelector('#mainSection04'),
                
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
        console.log(scrollRatio)
        switch (curSection){
            case 0 :
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
               
                break;
            case 2 :
                if(scrollRatio > 0.9){
                    objs.bg.style.transform = `translate3d( -${calcValues(values.bg_translateX_on, currentYOffset)}%,0, 0)`;

                    objs.title01.style.opacity = calcValues(values.title01_opacity_on, currentYOffset);
                    objs.title01.style.transform = `translate3d(0, ${calcValues(values.title01_translateY_on, currentYOffset)}%, 0)`;
                }else {
                    //off
                    objs.bg.style.transform = `translate3d( -${calcValues(values.bg_translateX_off, currentYOffset)}%,0, 0)`;

                    //off
                    objs.title01.style.opacity = calcValues(values.title01_opacity_off, currentYOffset);
                    objs.title01.style.transform = `translate3d(0, ${calcValues(values.title01_translateY_off, currentYOffset)}%, 0)`;
                }
                break;
            case 4 :
               

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
        })

        window.addEventListener('resize',()=>{
            if (window.innerWidth > 900) {
				window.location.reload();
			}
        });

        window.addEventListener('orientationchange', () => {
			scrollTo(0, 0);
			setTimeout(() => {
				window.location.reload();
			}, 500);
  		});
        
    }); 
    


}) ();