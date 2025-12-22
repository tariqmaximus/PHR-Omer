var myExtObject = (function() {

	return {
	  func1: function() {
		alert('function 1 called');
	  },
	  func2: function() {
		alert('function 2 called');
	  },
	  loadIrx: function (data,link){
		 
		$("#post_form").attr("action",link);
		$("#RxInput").val(data);
		$("#post_form").submit();
	},
	loadHTMLContents:function(html){
		var frame = document.getElementById("htmlDiv");
		frame.innerHTML = html;
	},
	 postForm:function(data,patid)
{

//	loadIrx(data,"https://secure.newcropaccounts.com/InterfaceV7/RxEntry.aspx");
  var postData = data;
	$.ajax({
    
        type: "post",
        url: "https://preproduction.newcropaccounts.com/InterfaceV7/RxEntry.aspx",
    data:  {RxInput: postData},
    //contentType: "application/x-www-form-urlencoded; charset:utf-8",
    contentType:"application/x-www-form-urlencoded",
   // AcceptEncoding: "gzip, deflate, br",
    //dataType:"xml",
        success: function (response) {
					alert(response);
            //getParentApp('flexproject').postPageResponse(true,patid);
        },
		error: function(){
			alert("Error"+error);
		//	getParentApp('flexproject').postPageResponse(false,patid);
		}
    });
},
 getParentApp:function(appName)
{
  if (navigator.appName.indexOf ("Microsoft") !=-1)
  {
    return this.parent.window[appName];
  } 
  else 
  {
    return this.parent.document[appName];
  } 
},
	 getHTMLContents:function()
{
	//GetHTML_doProcess();
	var frame = document.getElementById("htmlDiv");
	var finalHTML="<html><body>"+frame.innerHTML+"</body></html>";
	//alert(finalHTML);
	return finalHTML;
	//getParentApp('flexproject').getHTML(finalHTML);
},
setInputTextHeight:function(){
	if(document.formname.elements!=null)
	{
		for(i=0; i<document.formname.elements.length; i++)
		{
			var name = "";
			if(document.formname.elements[i].type=="text")
			{
				if(document.formname.elements[1].id != ""){
					name = document.formname.elements[i].id;
					document.getElementById(document.formname.elements[i].id).style.height="21px";
					document.getElementById(document.formname.elements[i].id).style.fontSize='13px';
					//$("#"+name ).style( "font-style", 'normal');
				}
			}
			// if(document.formname.elements[i].type=="textarea")
			// {
			// 	if(document.formname.elements[1].id != ""){
			// 		document.getElementById(document.formname.elements[i].id).style.height="35px"
			// 	}
			// }
		}
	}
},

 GetHTML_doProcess:function()
{
  try
  {
		debugger
	var i = 0;
	var oldRadName = "";
	if(document.formname.elements!=null)
	{
		for(i=0; i<document.formname.elements.length; i++)
		{
			var name = "";
			if(document.formname.elements[i].type=="text")
			{
				if(document.formname.elements[1].id != ""){
					 name = document.formname.elements[i].id;
					$("#"+name ).attr( "value", document.getElementById(name).value );
				}
			}
			else if(document.formname.elements[i].type=="checkbox"){
				name = document.formname.elements[i].id;
				$("#"+name ).attr( "checked", document.getElementById(name).checked);
				
			}
			else if(document.formname.elements[i].type=="radio"){
				name = document.formname.elements[i].name;
				if(name != oldRadName){
					oldRadName = name;
					var radItems = document.getElementsByName(name);
					for (var x = 0; x < radItems.length; x ++) {
							$("#"+radItems[x].id ).attr( "checked", radItems[x].checked);
					}
				}
			}
			else if(document.formname.elements[i].type=="textarea"){
				name = document.formname.elements[i].id;
				$("#"+name ).html( document.getElementById(name).value);
			}
			else if(document.formname.elements[i].type=="select-one"){
				name = document.formname.elements[i].name;
				if(name != oldRadName){
					oldRadName = name;
					var cmbItems = document.getElementsByName("cmbbx")[0].getElementsByTagName("option");
					for (var x = 0; x < cmbItems.length; x ++) {
							$("#"+cmbItems[x].id ).attr( "selected", cmbItems[x].selected);
					}
				}
			}
			name = "";
		}
	}
  }
  catch(err)
  {
    //alert(err)
  }
},
 resizeTextarea:function (id) {
  var a = document.getElementById(id);
  a.style.height = 'auto';
  a.style.height = a.scrollHeight+'px';
},
setHealthcheckProvidersSignatureInfo:function(Provider1_Sign_Info,Provider2_Sign_Info)
{
 try
  {
	var i = 0;
	var oldRadName = "";
	if(document.formname.elements!=null)
	{
		for(i=0; i<document.formname.elements.length; i++)
		{
			var name = "";
			if(document.formname.elements[i].type=="text")
			{
				if(document.formname.elements[1].id != ""){
					name = document.formname.elements[i].id;
					if(name=="txt_provider_1")
					{
						$("#"+name ).attr( "value", Provider1_Sign_Info );
					}
					if(name=="txt_provider_2")
					{
						$("#"+name ).attr( "value", Provider2_Sign_Info );
					}
				}						
			}			
			name = "";
		}
	}
  }
  catch(err)
  {
    //alert(err)
  }	
}
	}
  
  })(myExtObject||{})
  
  