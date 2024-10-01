import {Component, OnInit} from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import {useGeographic} from 'ol/proj.js';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import Zoom from 'ol/control/Zoom';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  // Declaro la variable map donde almaceno el mapa
  map!: Map;

  constructor() { }

  ngOnInit(): void {
    // Inicializo el mapa al iniciar el componente
    this.initMap();
  }

  // Declaración de las coordenadas que voy a utilizar dentro del center [Longitude, Latitud]
  // Google las da en el formato [Latitud, Longitude] por eso debo invertir
  private coords = [-72.49857396820478, 7.897432514821199];
  // Puntos que voy a mostrar en el mapa
  PARQUEADEROS:string = 'https://cdn-icons-png.flaticon.com/512/51/51778.png'
  COLEGIOS:string = 'https://cdn-icons-png.flaticon.com/512/2830/2830316.png'
  IGLESIAS:string = 'https://cdn-icons-png.flaticon.com/512/5438/5438502.png'
  public points = [
    { coords: [-72.49851467998661, 7.89754017896397], name: 'Gopenux Lab S.A.S', img: this.COLEGIOS },
    { coords: [-72.50179469393022, 7.881632887437397], name: 'Medellín', img: this.PARQUEADEROS },
    { coords: [-72.47875566741348, 7.922412075339184], name: 'Jardin Plaza', img: this.IGLESIAS }
  ];

  // Función para inicializar el mapa
  initMap(): void {
    // Habilito el uso de coordenadas geográficas
    useGeographic();

    // Creo una nueva instancia del mapa y la asigno a la variable map
    this.map = new Map({
      target: 'map',
      // Con esto defino las capas que voy a mostrar en el mapa
      layers: [
        new TileLayer({
          // La fuente de donde viene la información del mapa en este caso OSM (Open Street Maps)
          source: new OSM({
            attributions: []
          })
        }),
        this.createPointLayer()
      ],
      // Con esto defino la vista inicial del mapa
      view: new View({
        center: this.coords,
        zoom: 13.4
      }),
      controls: [
        new Zoom()  // Solo deja los botones de zoom
      ]
    });

  }



  // Función para crear una capa vectorial que contenga puntos (features)
  createPointLayer(): VectorLayer {
    // Creo una fuente de datos vectorial que contendrá los puntos
    const vectorSource = new VectorSource();

    // Recorro la lista de puntos y creo un feature (característica) para cada uno
    this.points.forEach(point => {
      const pointFeature = new Feature({
        geometry: new Point(point.coords),  // Coloco las coordenadas del punto
        name: point.name  // Agrego un nombre o propiedad adicional
      });

      // Puedo agregar un estilo opcional al punto, como un icono
      pointFeature.setStyle(new Style({
        image: new Icon({
          src: point.img,  // Puedes usar cualquier imagen para representar el marcador
          scale: 0.058// Escala de la imagen para ajustar el tamaño del icono
        })
      }));

      // Agrego cada punto (feature) al vector source
      vectorSource.addFeature(pointFeature);
    });

    // Creo la capa vectorial y le asigno el vector source
    return new VectorLayer({
      source: vectorSource
    });  // Retorno la capa vectorial
  }

}
