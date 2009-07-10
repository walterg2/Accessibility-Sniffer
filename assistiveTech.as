package {
       import flash.accessibility.Accessibility;
       import flash.display.LoaderInfo;
       import flash.display.Sprite;
       import flash.external.ExternalInterface;

       public class assistiveTech extends Sprite
       {
               public function assistiveTech()
               {
                       var info : LoaderInfo = this.root.loaderInfo;
                       var method : String = info.parameters.callback;

                       if ( method && ExternalInterface.available )
                       {
                               ExternalInterface.call( method, Accessibility.active );
                       }
               }
       }
}