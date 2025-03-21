### Руководство по компоненту ObjectsMap2
___
* **Назначение:** компонент служит для отображения объектов на карте. Каждый компонент окрашен в цвет своего статуса.
* **Пропсы:**   
    * objects - ID объектов для отображения, если не переданы, то объекты берутся из стора;
    * mapCenter - центр карты в формате *[долгота, широта]* необходим для инициализации карты (по умолчанию задан *[43.40758654559397, 39.95466648943133]*);  
    * startZoom - начальный zoom необходим для инициализации карты (по умолчанию задан *14*); 
    * fitToMarkers - переключатель (boolean) для отображения на карте всех объектов (в случае *true* mapCenter и startZoom будут проигнорированы);
    * objectFilters - фильтр объектов по классу, принимающий массив ID классов (classIds: [ ]). Если объекты изначально не переданы в компонент, то при передаче ID в objectFilters поиск производится в объектах из стора с дальнейшим выводом этих объектов;  
    * attributesBind - пропс для вывода контура объектов, который принимает либо attribute_id либо stereotype_id. Для вывода контура необходимо выбрать "Географическая форма". Если в attributesBind ничего не передано, объекты не будут отрисованы.
