# YgmSlide 

> https://yougmi.github.io/yougmi_slider/demo
#

## Slide HTML Layout

```html
<!-- Slider main container -->
<div id="sampleYgmSlide">
    <!-- Additional required container -->
    <div class="slide-container">
        <!-- Additional required wrapper -->
        <div class="slide-wrap">
            <!-- Slides -->
            <div class="slide-box"></div>
            <div class="slide-box"></div>
            <div class="slide-box"></div>
        </div>

         <!-- If we need navigation buttons -->
        <button type="button" class="btn btn-p">이전</button>
        <button type="button" class="btn btn-n">다음</button>
    
        <!-- If we need pagination -->
        <div class="navi"></div>
    </div>
</div>
```

## Initialize Slide

```javascript
var ygmSlide = new YgmSlide({
    elId: "sampleYgmSlide",
    idx: 2,
    autoDuration: 3000,
    navi: true,
});
```
## Parameters

|Name|Type|Default|Description|
|:---|:---|:---|:---|
|`elId`|`string`|`'id'`|슬라이드 영역 아이디(필수)|
|`idx`|`number`|`0`|처음 활성화 슬라이드의 인덱스|
|`loop`|`boolean`|`false`|루프|
|`navi`|`boolean`|`false`|페이지네이션|
|`auto`|`boolean`|`false`|자동 슬라이드|
|`autoDuration`|`number`|`2000`|자동 슬라이드 시간|
|`popable`|`boolean`|`false`|활성 슬라이드 클릭 시 팝업 활성화|
