 
var YgmSlide = function(option){
    // 함수 디폴드 옵션값
    this.elId = option.elId; // 슬라이드 아이디
    if (!this.elId) return false; // 슬라이드 아이디없을때

    this.idx = 0; // 활성화시킬 슬라이드의 인덱스
    this.loop = false; // 루프
    this.navi = false; // 페이지네이션
    this.auto = false; // 자동슬라이드
    this.autoDuration = 2000; // 자동슬라이드 시간
    this.popable = false; // 팝업 

    this.slideEl = document.getElementById(this.elId);
    this.slideBoxs = this.slideEl.getElementsByClassName("slide-box");
    this.naviDots = this.slideEl.getElementsByClassName("navi")[0].getElementsByTagName("span");
    this.viewWidth = this.slideBoxs[0].offsetWidth  ; // 슬라이드 한장의 넓이
    this.windowWidth = window.innerWidth; // 클릭 시작시에 위치값

    this.pointerFlag = false;// 클릭 중에만 동작하게 하는 변수;
    this.lastIndex = this.slideBoxs.length - 1; // 슬라이드 갯수
    this.translate = 0; // 클릭 시작시에 위치값

    // 옵션으로 입력한 값이 있는경우
    if (option.idx) {
        this.idx = option.idx;
    }
    if (option.loop !== undefined) {
        this.loop = option.loop;
    }
    if (option.navi !== undefined) {
        this.navi = option.navi;
    }
    if (option.auto !== undefined) {
        this.auto = option.auto;
    }
    if (option.autoDuration !== undefined) {
        this.autoDuration = option.autoDuration;
    }
    if (option.popable !== undefined) {
        this.popable = option.popable;
    }

    
    /*******[기능]***********************************************/
    this.active = function(idx){
        // 초기화
        for (var i = 0; i < this.slideBoxs.length; i++) {
            this.slideBoxs[i].classList.remove("active");
            if(this.navi) this.naviDots[i].classList.remove("active");
        }
        // 전달받은 index의 슬라이드 active class 추가
        this.slideBoxs[idx].classList.add("active");
        //옵션 navi가 있으면
        if(this.navi) {
            // 액티브된 슬라이드의 data-id
            var dataId = this.slideBoxs[idx].getAttribute("data-id");
            // 네비쩜 반복
            for (var i = 0; i < this.naviDots.length; i++) {
                // 네비의 data-id
                var naviDataId = this.naviDots[i].getAttribute("data-id");
                // 액티브된 슬라이드의 data-id 와 네비의 data-id 가 동일하면 네비에 엑티브 추가
                if(naviDataId == dataId) {
                    this.naviDots[i].classList.add("active");
                }
            }
        }

        // loop 옵션 값이 있는 경우 
        if (this.loop) {
            // 전달 받은 index의 이전슬라이드 없는 경우
            if (!this.slideBoxs[idx].previousElementSibling) {
                // 가장 마지막 슬라이드 맨 앞으로 가져오기 (index는 0부터 시작함으로 length-1)
                this.slideEl.getElementsByClassName("slide-wrap")[0].prepend(this.slideBoxs[this.lastIndex]);
                // 맨앞으로 슬라이드를 가져온 후 제자리로 위치조정
                // prepend 후 밀린슬라이드의 위치를 슬라이드넚이의 두배만큼 밀어준다. 
                // (이후, 원래 활성화될 슬라이드로 자연스럽게 이동하기위해).
                for (var i = 0; i < this.slideBoxs.length; i++) {
                    this.slideBoxs[i].style.transform = "translateX(-" + this.viewWidth * 2 + "px)";
                    this.slideBoxs[i].style.transition = "0s";
                }
                // 앞에 슬라이드 추가로 밀린 index 증가
                idx++;
            }
            // 가져온 index의 다음 요소가 없는 경우 
            if (!this.slideBoxs[idx].nextElementSibling) {
                // 첫번째 슬라이드를 마지막으로 이동
                this.slideEl.getElementsByClassName("slide-wrap")[0].append(this.slideBoxs[0]);
                // 마지막으로 이동 후 위치 조정
                // append 후 밀린슬라이드의 위치를 슬라이드넚이의 세배만큼 밀어준다. 
                // -1은 index은 0부터 시작해서, -2는 추가 된 슬라이드가 활성한 영역에 들어와서
                // -3은 이후, 원래 활성화될 슬라이드로 자연스럽게 이동하기위해
                for (var i = 0; i < this.slideBoxs.length; i++) {
                    this.slideBoxs[i].style.transform = "translateX(-" + (this.viewWidth * (this.lastIndex - 2)) + "px)";
                    this.slideBoxs[i].style.transition = "0s";
                }
                // 마지막 슬라이드 추가로 밀린 index 감소
                idx--;
            }
             // 앞이나 뒤에 슬라이드가 추가로 인해 css-transform 두가지가 동시에 동작 불가하기때문에
            // 1ms의 시간차를 줌
            var slider = this; //setTimeOut내에서 this는 
            setTimeout(function() {
                // 활성한 슬라이드가 보이도록 위치 조정 
                for (var i = 0; i < slider.slideBoxs.length; i++) {
                    slider.slideBoxs[i].style.transform = "translateX(-" + slider.viewWidth * idx + "px)";
                    slider.slideBoxs[i].style.transition = ".5s";
                }
                
            }, 1)
        // loop 옵션이 없는 경우 
        } else {           
            for (var i = 0; i < this.slideBoxs.length; i++) {
                this.slideBoxs[i].style.transform = "translateX(-" + this.viewWidth * idx + "px)";
                this.slideBoxs[i].style.transition = ".5s";
            }
        }

        this.idx = idx;
    }
    // 트렌스폼 동안 이벤트 중지 함수
    var eventStop = function(){
        event.stopPropagation();
    }
    // 슬라이드 자동넘기기 함수
    this.autoSlide = function(){
        var slider = this;
        if(!slider.auto) return;
        // 지정된 시간이 지나면 다음슬라이드 활성화
        // 해당 interval을 초기화 하기위해 변수에 담는다
        var autoTime = setInterval(function() {
            // 현재 index에 +1
            slider.idx++;
            if (slider.lastIndex < slider.idx) {
                slider.idx = 0;
            }
            // 활성화 시킬 슬라이드 index를 통해 슬라이드 활성화
            slider.active(slider.idx);
        }, slider.autoDuration)
        slider.autoTime = autoTime;
    }
    // 자동넘기기 초기화
    this.clearAutoSlide = function(){
        if(!this.auto) return;
        // autoslide 함수 내에서 저장한 interval 객체를 초기화한다
        clearInterval(this.autoTime);
    }
    // 네비 버튼생성 함수
    this.setNavi = function() {
        var navi = this.slideEl.getElementsByClassName("navi"); 
        // 네비게이션 슬라이드 갯수만큼 동적 생성
        var naviMk = "";
        // 마크업생성
        for (var i = 0; i <= this.lastIndex; i++) {
            naviMk += "<span data-id=" + i + ">" + (i + 1) + "</span>";
        }
        this.slideEl.getElementsByClassName("navi")[0].innerHTML = naviMk;
    }
    // 이전슬라이드로 이동
    var moveSlideToPrev = function(){
        this.clearAutoSlide();
        //현재 index에 -1 
        this.idx--;
        if (this.idx < 0) {
            this.idx = 0;
        }
        this.active(this.idx);
        this.autoSlide();
    }
    // 다음 슬라이드로 이동
    var moveSlideToNext = function(){
        this.clearAutoSlide();
        //현재 index에 +1 
        this.idx++;
        if (this.idx > this.lastIndex) {
            this.idx = this.lastIndex;
        }
        this.active(this.idx);
        this.autoSlide();
    }
    // 팝업 활성화
    var activePopup = function(){
        var nowActive =  getParentsEl("slide-box active",event.target);
        // 현재 딤이 켜져있는가 없는가
        var isdim = document.getElementsByClassName("dim").length;
        if(!isdim && nowActive) {
            //create dim
            var mkdim = document.createElement( 'div' )
            mkdim.classList.add("dim");
            // 딤에 클릭한 슬라이드의 변형전 스타일을 담음 ()
            this.bfstyle = JSON.parse(JSON.stringify(nowActive.style));
            // body에 딤요소 추가        
            document.body.appendChild( mkdim );
            this.clearAutoSlide();
            // 딤클릭이벤트 바인드
            document.getElementsByClassName("dim")[0].addEventListener("click",removePopup.bind(this));
            // 현재 트렌스레이트 조회 
            this.translate =  Number(this.slideBoxs[0].style.transform.substring(
                                this.slideBoxs[0].style.transform.indexOf("(")+1
                                ,this.slideBoxs[0].style.transform.indexOf(")"))
                                .replace("px",""));
            for(var i = 0; i < this.slideBoxs.length; i++) {
                this.slideBoxs[i].style.transition = "0s"
            }
            // 이전요소가 있다면 이전요소에 margin
            if (nowActive.previousElementSibling) {
                nowActive.previousElementSibling.style.marginRight = this.viewWidth +"px";
                this.targetEl = nowActive.previousElementSibling;
            // 없다면 다음요소에 margin
            }else {
                nowActive.nextElementSibling.style.marginLeft = this.viewWidth +"px";
                this.targetEl = nowActive.nextElementSibling;
            }
            // 슬라이드 박스 팝업 스타일
            nowActive.style.transform = "translateX("+this.translate+"px) scale(1.5)";
            nowActive.style.transition = ".5s"
            nowActive.style.position = "absolute";
            nowActive.style.left = -(this.translate)+"px";
            nowActive.style.zIndex = 10;
            event.target.removeEventListener("click",activePopup);
        }
    }
    // 활성화된 팝업 닫기
    var removePopup = function(){
        var dim = document.getElementsByClassName("dim");
        var activeSlide = this.slideEl.getElementsByClassName("slide-box active");
        //  여백제거
        this.targetEl.style.marginRight = 0;
        this.targetEl.style.marginLeft = 0;
        // 기존에 스타일 복구
        activeSlide[0].style.transform = this.bfstyle.transform;
        activeSlide[0].style.position = this.bfstyle.position;
        activeSlide[0].style.zIndex = this.bfstyle.zIndex;
        dim[0].remove();// 딤삭제
        event.target.removeEventListener("click",this);
        this.autoSlide();
    }
    // 스와이프시작점 셋팅
    var setStartPoint = function(){
        if (!event.target.classList.contains("btn") && !event.target.parentNode.classList.contains("navi")) {
            this.slideEl.setAttribute("s_point", event.pageX);
            this.pointerFlag = true;
            // 시작점을 저장
            this.translate =  Number(this.slideBoxs[0].style.transform.substring(
                                        this.slideBoxs[0].style.transform.indexOf("(")+1
                                        ,this.slideBoxs[0].style.transform.indexOf(")"))
                                        .replace("px",""));
            this.clearAutoSlide();
        };
    }
    // 슬라이드를 스와이프
    var moveSlide = function(){
        if (this.pointerFlag) {
            // 시작 좌표값을 가진 변수
            var startPoint = Number(this.slideEl.getAttribute("s_point"));
            // 포인터가 움직인 값만큼 슬라이드를 움직인다.
            for(var i=0; i<this.slideBoxs.length; i++){
                this.slideBoxs[i].style.transform = "translateX(" + (this.translate - startPoint + event.pageX) + "px)";
                this.slideBoxs[i].style.transition = "0s";
            }
        }
    }
    // 마우스를 때거나 영역을 벗어났을때 가장가까운 슬라이드를 활성화
    var activeSlideWithPoint = function(){
        if (this.pointerFlag && !event.target.classList.contains("btn") && ! event.target.parentNode.classList.contains("navi")) {
            this.pointerFlag = false;
            // 현재 슬라이드 위치
            var nowTranslate = Number(this.slideBoxs[0].style.transform.substring(
                                    this.slideBoxs[0].style.transform.indexOf("(")+1
                                    ,this.slideBoxs[0].style.transform.indexOf(")"))
                                    .replace("px",""));
            // 현재 슬라이드 위치 나누기 슬라이드 한장의 넓이 를 반올림
            var idx = Math.abs(Math.round(nowTranslate / this.viewWidth));
            if(nowTranslate > 0) idx = 0;
            else if (nowTranslate < -(this.slideBoxs.length*this.viewWidth)) idx = this.lastIndex;
            if(idx > this.lastIndex) idx = this.lastIndex;
            this.active(idx);
        }
    }
    // 네비를 클릭했을때 슬라이드를 엑티브 시킨다
    var activeSlideWithNavi = function(){
        var dataId = event.target.getAttribute("data-id");
        for (var i = 0; i < this.slideBoxs.length; i++) {
            var slideDataId = this.slideBoxs[i].getAttribute("data-id");
            if(slideDataId == dataId) {
                this.active(i);
            }
        }
    }
    // 슬라이드에서 사용되는 모든이벤트를 바인드 한다.
    this.evntBind = function(){
        // 이전 다음버튼 클릭 이벤트
        this.slideEl.getElementsByClassName("btn-p")[0].addEventListener("click",moveSlideToPrev.bind(this));
        this.slideEl.getElementsByClassName("btn-n")[0].addEventListener("click",moveSlideToNext.bind(this));
        // 네비버튼 클릭이벤트
        if(this.navi) {
            for(var i = 0 ; i < this.naviDots.length; i++) {
                this.naviDots[i].addEventListener("click",activeSlideWithNavi.bind(this));
            }
        }
        // 슬라이드가 움직이는 중에는 모든이벤트 중지
        this.slideBoxs[0].addEventListener("transitionstart",function(){
            document.addEventListener("click",eventStop,{capture: true});
        })
        // 슬라이드가 움직인후 이벤트 중지 제거
        this.slideBoxs[0].addEventListener("transitionend",function(){
            document.removeEventListener("click",eventStop,{capture: true});
        })
        if(this.popable) {
            // 팝업 
            for(var i = 0 ; i < this.slideBoxs.length; i++) {
                this.slideBoxs[i].addEventListener("click",activePopup.bind(this));
            }
        } else {
            // 마우스 눌렀을때 이벤트
            this.slideEl.addEventListener("mousedown",setStartPoint.bind(this));
            // 마우스 땠을때 이벤트 
            this.slideEl.addEventListener("mouseup",activeSlideWithPoint.bind(this));
            // 마우스 움직였을때 이벤트
            this.slideEl.addEventListener("mousemove",moveSlide.bind(this));
            // 마우스가 벗어났을때 이벤트
            this.slideEl.addEventListener("mouseout",activeSlideWithPoint.bind(this));
        }
        // for resize 
        window.addEventListener("resize",resize.bind(this));
    }

    // 초기화
    this.init = function() {
        
        // add attribute to Slide ("data-id" ...  for navi btn click event)
        for (var i =0; i < this.slideBoxs.length; i++) {
            this.slideBoxs[i].setAttribute("data-id",i); 
        }
        if(this.auto) {
            // init interval
            this.clearAutoSlide();
            this.autoSlide();
        }
        if(this.navi) {
            this.setNavi();
        }
        this.active(this.idx);
        this.evntBind();

        var slider = this;
        
    }

    // 리사이즈 이벤트 함수
    function resize(){
        // 리사이즈 되고난후 변하는 width값을 가져온다
        this.viewWidth = this.slideBoxs[0].offsetWidth  ; // 슬라이드 한장의 넓이
        // 변경 된 view width 값으로 슬라이드 활성화
        this.active(this.idx);
     }

    // 부모요소 조회
    function getParentsEl(name, node) {
        while(node){
            var nameArr = name.split(" ");
            var flag = true;
            for(var i=0; i<nameArr.length; i++){
                if (node.tagName == "BODY") return;
                flag = node.classList.contains(nameArr[i]);
                if(!flag) break;
            }
            if(flag) return node;
            if(!node.parentNode) return;
            node = node.parentNode;
        }
    }
    // 초기화 함수 실행
    this.init();
}