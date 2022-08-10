import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';


import { QuestionButtonsBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import {  FormGroup } from '@angular/forms';
import { BezierConnector } from '@jsplumb/connector-bezier';



@Component({
  selector: 'app-question-buttons',
  templateUrl: './question-buttons.component.html',
  styleUrls: ['./question-buttons.component.scss']
})



export class QuestionButtonsComponent<T> implements OnInit, AfterViewInit {

  @Input() buttonsBlock: FormGroup;
  @Input() formGroupNameInput: string | number;
  @Input () jsPlumb:BrowserJsPlumbInstance;
 
  inputID: string;
  click: boolean =false;
  button= Array.from(document.getElementsByTagName("input"));
  buttonClicked:number=0;

onButtonclick(){
  if(this.button.length >5){
    this.click= true;

  }
}



ngOnInit(): void {
  //create the Unique ID on initialization
  this.inputID= `${this.formGroupNameInput}-${this.buttonsBlock.value.id}`;

}



ngAfterViewInit(): void {
      //Captures the elements that are in the input tag with the unique input ID created above
  let inputElement = document.getElementById(this.inputID) as Element;

  this.jsPlumb.addEndpoint(inputElement, {
    // Whether the anchor is source (This Block -> Other Block)
    source: true,

    // Type of endpoint to render
    endpoint: 'Dot',
    // Where to position the anchor
    anchor: "Right",
    connector: {
      type: BezierConnector.type,
      options: { 
        curviness: 100
      }
    }
   });

 }
}