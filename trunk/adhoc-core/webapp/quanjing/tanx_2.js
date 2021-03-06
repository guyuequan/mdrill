
	  function showTooltip(n,x, y, contents) {
  	    $("#axis_id_index_y"+n).css({ opacity: 0.10 });
        $('<div id="tooltip" axix=\''+n+'\'>' + contents + '</div>').css( {
            position: 'absolute',
            display: 'none',
            top: y + 5,
            left: x + 5,
            border: '1px solid #fdd',
            padding: '2px',
            'background-color': '#fee',
            opacity: 0.80
        }).appendTo("body").fadeIn(200);
    }
    
     
         
	 updateLegendTimeout = null;
	 latestPosition = null;
	     var previousPoint = null;

function updateLegend() {

			updateLegendTimeout = null;

			var pos = latestPosition;
		

			var axes = plot.getAxes();
			if (pos.x < axes.xaxis.min || pos.x > axes.xaxis.max ||
				pos.y < axes.yaxis.min || pos.y > axes.yaxis.max) {
				return;
			}

						var legends = $("#placeholder .legendLabel");

			var i, j, dataset = plot.getData();
			for (i = 0; i < dataset.length; ++i) {

					var series = dataset[i];	
					for (j = 0; j < series.data.length; ++j) {
						if (series.data[j]!=null&&series.data[j][0] > pos.x) {
							var p2=series.data[j];

							for(var k=(j-1);k>=0;k--)
							{
								if(series.data[k]!=null)
								{
										var p1=series.data[k];
										var y=p1[1]*1 + (p2[1] - p1[1]) * (pos.x - p1[0]) / (p2[0] - p1[0]);
										
										var fixresult=y.toFixed(2);
										
										if(series.label.indexOf("pv")>=0)
										{
											fixresult=y.toFixed(0);
										}
										
										if(series.label.indexOf("=")>=0)
										{
											legends.eq(i).text(series.label.replace(/=.*/, "= " + fixresult));//.toFixed(2)
										}else{
											legends.eq(i).text(series.label+"="+fixresult);
										}
										
										break ;
								}
							}
							
					
							break;
						}
					}

					
			}
		}
		
		 var plot=null;


	function plotAccordingToChoices() {
        var data = [];

        choiceContainer.find("input:checked").each(function () {
            var key = $(this).attr("name");
            if (key && datasets[key])
                data.push(datasets[key]);
        });
        
        if(data.length<=0)
        {
        		alert("请至少选择一种数据");
        		return ;
        	
        }

        if (data.length > 0)
        {
            plot =$.plot($("#placeholder"), data, {
            	
               series: {
                   lines: { show: true },
                   points: { show: false }
               },
               legend: {
							   	  backgroundOpacity: 0.15 ,

                    position: "nw" // position of default legend container within plot
              
                },
                crosshair: {
								mode: "x"
								},
               grid: { hoverable: true, clickable: true }     ,
                yaxis: { 
                	alignTicksWithAxis: null,
									position: "right"
                	},
                xaxis: {  	  
                	mode: "time",
                minTickSize: [1, "minute"],
                //min: mdrilldata.min,
                //max: mdrilldata.max,
                timeformat:"%h:%M"
              }
             
            }
            );
            
      $.each(plot.getAxes(), function (i, axis) {
			if (!axis.show)
				return;

			var box = axis.box;

			$("<div id='axis_id_index_"+axis.direction+axis.n+"' class='axisTarget' style='position:absolute; left:" + box.left + "px; top:" + box.top + "px; width:" + box.width +  "px; height:" + box.height + "px'></div>")
				.data("axis.direction", axis.direction)
				.data("axis.n", axis.n)
				.css({ backgroundColor: "#f00", opacity: 0, cursor: "pointer" })
				.appendTo(plot.getPlaceholder())
				.hover(
					function () { $(this).css({ opacity: 0.10 }) },
					function () { $(this).css({ opacity: 0 }) }
				);
		}); 
   }
   
   
   
    var previousPoint = null;
    $("#placeholder").bind("plothover", function (event, pos, item) {
    	if(!pos||!pos.x||!pos.y)
    	{
    		return ;
    	}
    	
   

        if ($("#enableTooltip:checked").length > 0) {
            if (item) {
                if (previousPoint != item.dataIndex) {
                    previousPoint = item.dataIndex;
                                	  	    $("#axis_id_index_y"+$("#tooltip").attr("axix")).css({ opacity: 0 });

                    $("#tooltip").remove();
                    var x = item.datapoint[0].toFixed(2),
                        y = item.datapoint[1].toFixed(2);
                        
                    
                    showTooltip(item.series.yaxis.n,item.pageX, item.pageY, $.plot.formatDate(new Date(parseInt(x)),"%h:%M")+"="+y);//     item.series.label + " of " + x + " = " + y
                }
            }
            else {
            	
            	  	    $("#axis_id_index_y"+$("#tooltip").attr("axix")).css({ opacity: 0 });

            	
                $("#tooltip").remove();
                
                
                
                previousPoint = null;            
            }
        }
        
        latestPosition = pos;
			if (!updateLegendTimeout) {
				updateLegendTimeout = setTimeout(updateLegend, 50);
			}
    });
    
    
	

    $("#placeholder").bind("plotclick", function (event, pos, item) {
        if (item) {
            $("#clickdata").text("You clicked point " + item.dataIndex + " in " + item.series.label + ".");
            plot.highlight(item.series, item.datapoint);
        }
    });
            
  
  }
  
  
        
   
    

function getMaxShowTs()
{
	var d=new Date();
	return d.getTime()-1000*590;
}

	
		   
	function dayToTimestamp2(str)
	{
		if(str.length<=10)
		{
			str+=" 00:00:00";
		}
	var new_str = str.replace(/:/g,'-');
		new_str = new_str.replace(/ /g,'-');
	var arr = new_str.split("-");
	if(arr.length<=5)
	{
		return 0;
	}
	
		var datum = new Date(Date.UTC(arr[0],arr[1]-1,arr[2],arr[3]-8,arr[4],arr[5]));
	
		return datum.getTime();
	}
	
			function dayToTimestampDay(s1)
	{

		return dayToTimestamp2(s1.substring(0,4)+"-"+s1.substring(4,6)+"-"+s1.substring(6));
	}
	
			function dayToTimestampDayHourMin(s1,hour)
	{

			var splitday=s1.substring(0,4)+"-"+s1.substring(4,6)+"-"+s1.substring(6)+" "+hour.substring(0,2)+":"+hour.substring(2,4)+":00";
			
		return dayToTimestamp2(splitday);
	}
	
   
		function dayToTimestamp(s1,s2)
	{

		var t1= dayToTimestamp2(s1.substring(0,4)+"-"+s1.substring(4,6)+"-"+s1.substring(6));
		var t2= dayToTimestamp2(s2.substring(0,4)+"-"+s2.substring(4,6)+"-"+s2.substring(6));
		
		return (t2-t1)/(1000*3600*24);
	}
	
	function showload()
	{
		
		      document.getElementById("loading").style.display="";  

          jQuery('#loading-one').empty().append('loading...').parent().fadeIn('slow'); 
	}
	
	
	function hideload()
	{
		
		          document.getElementById("loading").style.display="none";  

	}
	

function parseDay(date)
{
    var month = date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);   
    var day = date.getDate() <= 9 ? "0" + (date.getDate()) : (date.getDate());   
    var hour = date.getHours() <= 9 ? "0" + (date.getHours()) : (date.getHours());
    var yyyymmdd= (date.getFullYear() + "" + month + "" + day);         
    return yyyymmdd;
}




	
	
	function makediffRate(clickdata,pvData)
{

	if(!clickdata||!pvData)
	{
		return [];
	}
	var rate={};
	for(var i=0;i<clickdata.length;i++)
	{
		if(clickdata[i]&&clickdata[i].length>=2)
		{
			rate[clickdata[i][0]]=clickdata[i][1];
		}
	}
	
		
	
	var rtn=[];
	
		for(var i=0;i<pvData.length;i++)
	{
		if(pvData[i]&&pvData[i].length>=2)
		{
			if(pvData[i][1]>0)
			{
				if(rate[pvData[i][0]])
				{
					var clknum=rate[pvData[i][0]];
					if(clknum>0)
					{
						var ratenum=((clknum-pvData[i][1])*100/pvData[i][1]);
						if(ratenum>=9999)
						{
							rtn.push([pvData[i][0],999]);
						}if(ratenum<=-9999){
							
														rtn.push([pvData[i][0],-999]);

							}else{
														rtn.push([pvData[i][0],ratenum]);

	}

					}
				}
			

			}
		}
	}

	return rtn;
}

function makeClickRage(clickdata,pvData)
{

	if(!clickdata||!pvData)
	{
		return [];
	}
	var rate={};
	for(var i=0;i<clickdata.length;i++)
	{
		if(clickdata[i]&&clickdata[i].length>=2)
		{
			rate[clickdata[i][0]]=clickdata[i][1];
		}
	}
	
		
	
	var rtn=[];
	
		for(var i=0;i<pvData.length;i++)
	{
		if(pvData[i]&&pvData[i].length>=2)
		{
			if(pvData[i][1]>0)
			{
				var clknum=0;
				if(rate[pvData[i][0]])
				{
					clknum=rate[pvData[i][0]];
				}
				var ratenum=(clknum*100/pvData[i][1]);
				if(ratenum<=110)
				{
					rtn.push([pvData[i][0],ratenum]);
				}
			}
		}
	}

	return rtn;
	
}

function filterData(data)
{
			var rtn=[];
			var ts=getMaxShowTs();
			for(var i=0;i<data.length;i++)
			{
				 if(data[i][0]<=ts)
				 {
				 rtn.push(data[i]);
				 
					}
				
			}
			
			return rtn;
}



function sumData(data)
{
			var rtn=[];
			var sum=0;
			for(var i=0;i<data.length;i++)
			{
				sum+=data[i][1];
				 rtn.push([data[i][0],sum]);
			}
			
			return rtn;
}



function getBaseFq(tp)
{
	var strproducttype=jQuery("#producttype").val();
	var thepid=jQuery("#thepid").val();
	
	var newq=[];
	
	if($("#matchmode").val()=="keyword")
	
	{
		return newq;
}
	  if(strproducttype!='all'&&tp=='pv')
	  {
	  	newq.push({"producttype":{"operate":1,"value":strproducttype}});
	  }
	  if(thepid!='*'&&thepid!="")
	  {
	  	newq.push({"pid":{"operate":1,"value":thepid}});
	  }
	  return newq;
}


function requestClick(strtype,pidlist,daybefore,label,lableName,YLabel,colorNum)
{
			var strproducttype=jQuery("#producttype").val();
		var chooseday=jQuery("#thedateStart").val();
		var datts=dayToTimestampDay(chooseday);
		var dayChooseBefore=parseDay(new Date(datts-daybefore*24*60*60*1000));
		var strtablename=table_click[0];
		var todayStr=parseDay(new Date());
		if(todayStr!=dayChooseBefore)
		{
			strtablename=table_click[1];
		}
		var newq=getBaseFq('click');
	  newq.push({"thedate":{"operate":1,"value":dayChooseBefore}});
  newq.push({"pid":{"operate":6,"value":pidlist}});

	  	var requestparams={};
			requestparams.start=0;
			requestparams.rows=10000;
			requestparams.project=strtablename;
			requestparams.order="asc";
			requestparams.sort="miniute_5";
			requestparams.groupby="miniute_5";
			requestparams.fl="miniute_5,sum(records)";
		 requestparams.q=JSON.stringify(newq);
		 
			$.post("/result.jsp",requestparams,
					function (data, textStatus){	
						
						if(data.code!="1")
						{
								alert("服务器异常，请稍后再试");
								hideload();
								return ;
						}
						
						var returnresult=[];
						var listtmp=data.data.docs;
						for(var i=0;i<listtmp.length;i++)
						{
							var item=listtmp[i];
							var records=parseFloat(item["sum(records)"]);
							returnresult.push([dayToTimestampDayHourMin(chooseday,item["miniute_5"]),records]);
						}
						showresult(label,returnresult,YLabel,colorNum,lableName);
				
				}, "json");
}



var table_click=["tanx_click","rpt_quanjing_tanxclick"];
var table_pv=["tanx_pv","rpt_quanjing_tanxpv"];


function requestPV(strtype,pidlist,daybefore,label,lableName,YLabel,colorNum)
{
			var strproducttype=jQuery("#producttype").val();
		var chooseday=jQuery("#thedateStart").val();
		var datts=dayToTimestampDay(chooseday);
		var dayChooseBefore=parseDay(new Date(datts-daybefore*24*60*60*1000));

	
	var strtablename=table_pv[0];
		var todayStr=parseDay(new Date());
		if(todayStr!=dayChooseBefore)
		{
			strtablename=table_pv[1];
		}
		
		
	
		var newq=getBaseFq('pv');
	  newq.push({"thedate":{"operate":1,"value":[dayChooseBefore]}});
	   if(strtype==2)
	  {
	  		  newq.push({"pid":{"operate":6,"value":pidlist}});
	  }
	  	var requestparams={};
			requestparams.start=0;
			requestparams.rows=10000;
			requestparams.project=strtablename;
			requestparams.order="asc";
			requestparams.sort="miniute_5";
			requestparams.groupby="miniute_5";
			requestparams.fl="miniute_5,sum(records)";
		 requestparams.q=JSON.stringify(newq);
		 
			$.post("/result.jsp",requestparams,
					function (data, textStatus){	
						
						if(data.code!="1")
						{
								alert("服务器异常，请稍后再试");
								hideload();
								return ;
						}
					
						var returnresult=[];
						var listtmp=data.data.docs;
						for(var i=0;i<listtmp.length;i++)
						{
							var item=listtmp[i];
							var records=parseFloat(item["sum(records)"]);
							returnresult.push([dayToTimestampDayHourMin(chooseday,item["miniute_5"]),records]);
						}
						showresult(label,returnresult,YLabel,colorNum,lableName);
			
				}, "json");
}




function requestClick_AVG(strtype,pidlist,label,lableName,YLabel,colorNum)
{
			var strproducttype=jQuery("#producttype").val();
		var chooseday=jQuery("#thedateStart").val();
		var datts=dayToTimestampDay(chooseday);
		var daystart=parseDay(new Date(datts-8*24*60*60*1000));
		var dayend=parseDay(new Date(datts-1*24*60*60*1000));
		if("20140118">=daystart)
		{
			daystart="20140118";
		}
	
		var newq=getBaseFq('click');
	  newq.push({"thedate":{"operate":9,"value":[daystart,dayend]}});
		newq.push({"pid":{"operate":6,"value":pidlist}});
	  
	  	var requestparams={};
			requestparams.start=0;
			requestparams.rows=10000;
			requestparams.project=table_click[1];
			requestparams.order="asc";
			requestparams.sort="miniute_5";
			requestparams.groupby="miniute_5";
			requestparams.fl="miniute_5,sum(records),dist(thedate)";
		 requestparams.q=JSON.stringify(newq);
		 
			$.post("/result.jsp",requestparams,
					function (data, textStatus){	
						
						if(data.code!="1")
						{
								alert("服务器异常，请稍后再试");
								hideload();
								return ;
						}
						
						if(data.total<=0)
						{
								//alert("没查到匹配的数据");
								//hideload();
								//return ;
						}
						var returnresult=[];
						var listtmp=data.data.docs;
						for(var i=0;i<listtmp.length;i++)
						{
							var item=listtmp[i];
							var records=parseFloat(item["sum(records)"]);
							var days=parseFloat(item["dist(thedate)"]);
							if(days<=1)
							{
								days=1;
							}
							returnresult.push([dayToTimestampDayHourMin(chooseday,item["miniute_5"]),records/days]);
						}
						
						showresult(label,returnresult,YLabel,colorNum,lableName);
				}, "json"); 
}




function requestPV_AVG(strtype,pidlist,label,lableName,YLabel,colorNum)
{
			var strproducttype=jQuery("#producttype").val();
		var chooseday=jQuery("#thedateStart").val();
		var datts=dayToTimestampDay(chooseday);
		var daystart=parseDay(new Date(datts-8*24*60*60*1000));
			if("20140118">=daystart)
		{
			daystart="20140118";
		}
		var dayend=parseDay(new Date(datts-1*24*60*60*1000));
	
		var newq=getBaseFq('pv');
	  newq.push({"thedate":{"operate":9,"value":[daystart,dayend]}});
	   if(strtype==2)
	  {
	  		  newq.push({"pid":{"operate":6,"value":pidlist}});
	  }
	  	var requestparams={};
			requestparams.start=0;
			requestparams.rows=10000;
			requestparams.project=table_pv[1];
			requestparams.order="asc";
			requestparams.sort="miniute_5";
			requestparams.groupby="miniute_5";
			requestparams.fl="miniute_5,sum(records),dist(thedate)";
		 requestparams.q=JSON.stringify(newq);
		 
			$.post("/result.jsp",requestparams,
					function (data, textStatus){	
						
						if(data.code!="1")
						{
								alert("服务器异常，请稍后再试");
								hideload();
								return ;
						}
					
						var returnresult=[];
						var listtmp=data.data.docs;
						for(var i=0;i<listtmp.length;i++)
						{
							var item=listtmp[i];
							var records=parseFloat(item["sum(records)"]);
							var days=parseFloat(item["dist(thedate)"]);
							if(days<=1)
							{
								days=1;
							}
														
							returnresult.push([dayToTimestampDayHourMin(chooseday,item["miniute_5"]),records/days]);
						}
						
						showresult(label,returnresult,YLabel,colorNum,lableName);				
				}, "json");
		 
}


var g_pidlist={};
function requestpidlist(tp,rrrr)
{
	g_pidlist[tp]=rrrr;
	
	if(g_pidlist['realtime']&&g_pidlist['offline'])
	{
		
		 var pidlistmap={};
			for(var p in g_pidlist)
			{
						var data=g_pidlist[p]
							if(data.code!="1")
							{
									continue;
							}
	
							
							var listtmp=data.data.docs;
							for(var i=0;i<listtmp.length;i++)
							{
								var item=listtmp[i];
								pidlistmap[item['pid']]=1;
							}
			}
		
					var pidlist=[];
					for(var p in pidlistmap)
					{
						pidlist.push(p);
						
					}

		
		if(pidlist.length<=0)
				{
						if(thepid!='*'&&thepid!="")
					  {
							pidlist.push(thepid);
					  }else{
							alert("没查到匹配的数据");
							hideload();
							return ;
					}
				}
		
		searchData(1,pidlist);

		
	}
}





var g_isrequestpid=true;


function tooglepidlist()
{
	
	
timeseries($("#showpidlist").val());
	
}

function timeseries(pppid)
{
	
	if(!pppid||pppid=="*")
	{
		$("#showpidlist").empty();
		$("#showpidlist").hide();
	}

	
	var strproducttype=jQuery("#producttype").val();
	var chooseday=jQuery("#thedateStart").val();
	var datts=dayToTimestampDay(chooseday);
	var daystart=parseDay(new Date(datts-8*24*60*60*1000));
		if("20140118">=daystart)
		{
			daystart="20140118";
		}
			var thepid=jQuery("#thepid").val();

	var dayend2=parseDay(new Date(datts-2*24*60*60*1000));
	var dayend=parseDay(new Date(datts-1*24*60*60*1000));
	g_result={};
	g_pidlist={};
	
			 showload();
			 
			 
			 
	if($("#matchmode").val()=="keyword")
	
	{
		
		
		if(pppid&&pppid!="*")
	{
		searchData(2,[pppid]);
		return ;
	}
		
		(function(){
		
			var newq=[];
			var filterObj={"operate":1};
			filterObj["value"]=jQuery("#searchkeyword").val();
			newq.push({"thedate":{"operate":9,"value":[dayend2,dayend]}});
			newq.push({"sitename":filterObj});
			newq.push({"status":{"operate":1,"value":["A"]}});

	
	  	var requestparams={};
			requestparams.start=0;
			requestparams.rows=5010;
			requestparams.project="s_ods_mm_adzones";
			requestparams.order="desc";
			requestparams.sort="updatetime";
			requestparams.groupby="memberid,siteid,adzoneid,sitename,updatetime,name";
			requestparams.fl="memberid,siteid,adzoneid,sitename,updatetime,name,count(*)";
		 requestparams.q=JSON.stringify(newq);
		 
		 	$.post("/result.jsp",requestparams,
					function (data, textStatus){	
		 					
							if(data.code!="1")
							{
							alert("服务器异常，请稍后再试。");
							hideload();;
							return ;
							}
	
							$("#showpidlist").append("<option value='*'>全部</option>");

							var pidlist=[];
							var listtmp=data.data.docs;
							for(var i=0;i<listtmp.length&&i<10010;i++)
							{
								var item=listtmp[i];
								var strpid="mm_"+item["memberid"]+"_"+item["siteid"]+"_"+item["adzoneid"];
								pidlist.push(strpid);
								
								if(i<500)
								{
										$("#showpidlist").append("<option value='"+strpid+"'>"+strpid+" "+item["sitename"]+" "+item["updatetime"]+" "+item["name"]+"</option>");
									
								}
							}
							
								$("#showpidlist").show();

							
							if(pidlist.length>5000)
							{
								alert("该关键词匹配的PID太多,超过5000了，请进一步完善匹配的关键词,以缩小范围");							
							}
							
						searchData(2,pidlist);
		 					
		 	}, "json");
			})();
	
		return ;
		
	}
	
			 
			 
			 
			 	if(!g_isrequestpid)
	{
		
				searchData(1,[]);

			return ;
	}
			 
			 
			 (function(){
			 	
			var newq=getBaseFq('pv');
			newq.push({"thedate":{"operate":9,"value":[daystart,chooseday]}});
	  	var requestparams={};
			requestparams.start=0;
			requestparams.rows=10000;
			requestparams.project=table_pv[1];
			requestparams.order="desc";
			requestparams.sort="count(*)";
			requestparams.groupby="pid";
			requestparams.fl="pid,count(*)";
		 requestparams.q=JSON.stringify(newq);
		 
		 	$.post("/result.jsp",requestparams,
					function (data, textStatus){	
		 					requestpidlist("offline",data);
		 	}, "json");
			})();

		
		 	(function(){
		 		
		 		
		 var strtablename=table_pv[0];
		var todayStr=parseDay(new Date());
		if(todayStr!=chooseday)
		{
			strtablename=table_pv[1];
		}
		 	
			var newq=getBaseFq('pv');
			newq.push({"thedate":{"operate":1,"value":[chooseday]}});
	  	var requestparams={};
			requestparams.start=0;
			requestparams.rows=10000;
			requestparams.project=strtablename;
			requestparams.order="desc";
			requestparams.sort="count(*)";
			requestparams.groupby="pid";
			requestparams.fl="pid,count(*)";
		 requestparams.q=JSON.stringify(newq);
		 	
		 	
		 	 	$.post("/result.jsp",requestparams,
					function (data, textStatus){	
		 			requestpidlist("realtime",data);
		 	}, "json");
		 		
		 		
		 			})();
		 	

}



function showresult(tp,data,YPOS,color,label)
{
	var filterd=data;
	if(tp.indexOf("today")>=0)
	{
		filterd=filterData(data);
	}
	
	g_result[tp]={'data':filterd,'label':label,"Y":YPOS,'color':color};
	
	for(var i=0;i<typeshow.length;i++)
	{
		if(!g_result[typeshow[i]])
		{
			return ;
		}
	}
	
	
	
		hideload();
		
		
		
		
		if(!g_result['zeroarr'])
		{
			
		if(g_result["pv_today"])
		{
			g_result['pv_today_sum']={'data':sumData(g_result['pv_today']['data']),'label':'当日累计pv',"Y":'pvsum'};
		}
		
		if(g_result["pvbefore1"])
		{
			g_result['pvbefore1_sum']={'data':sumData(g_result['pvbefore1']['data']),'label':'昨日累计pv',"Y":'pvsum'};
		}
		
		if(g_result["pvbefore7"])
		{
			g_result['pvbefore7_sum']={'data':sumData(g_result['pvbefore7']['data']),'label':'上周同日累计pv',"Y":'pvsum'};
		}
		
		if(g_result["pv_avg"])
		{
			g_result['pv_avg_sum']={'data':sumData(g_result['pv_avg']['data']),'label':'7日平均累计pv',"Y":'pvsum'};
		}
		
		
		
			
		
		if(g_result["click_today"])
		{
			g_result['click_today_sum']={'data':sumData(g_result['click_today']['data']),'label':'当日累计点击',"Y":'clicksum'};
		}
		
		if(g_result["clickbefore1"])
		{
			g_result['clickbefore1_sum']={'data':sumData(g_result['clickbefore1']['data']),'label':'昨日累计点击',"Y":'clicksum'};
		}
		
		if(g_result["clickbefore7"])
		{
			g_result['clickbefore7_sum']={'data':sumData(g_result['clickbefore7']['data']),'label':'上周同日累计点击',"Y":'clicksum'};
		}
		
		if(g_result["click_avg"])
		{
			g_result['click_avg_sum']={'data':sumData(g_result['click_avg']['data']),'label':'7日平均累计点击',"Y":'clicksum'};
		}
		
		
		
		if(g_result["pv_today"]&&g_result["click_today"])
		{
			g_result['today_clickrate']={'data':makeClickRage(g_result['click_today']['data'],g_result['pv_today']['data']),'label':'当日点击率%',"Y":'rate'};
		}
		
		if(g_result["pvbefore1"]&&g_result["clickbefore1"])
		{
			g_result['pvbefore1_clickrate']={'data':makeClickRage(g_result['clickbefore1']['data'],g_result['pvbefore1']['data']),'label':'昨日点击率%',"Y":'rate'};
		}
		
		if(g_result["pvbefore7"]&&g_result["clickbefore7"])
		{
			g_result['pvbefore7_clickrate']={'data':makeClickRage(g_result['clickbefore7']['data'],g_result['pvbefore7']['data']),'label':'上周同日点击率%',"Y":'rate'};
		}
		
		if(g_result["pv_avg"]&&g_result["click_avg"])
		{
			g_result['avg_clickrate']={'data':makeClickRage(g_result['click_avg']['data'],g_result['pv_avg']['data']),'label':'七日平均点击率%',"Y":'rate'};
		}
		
		
		
		if(g_result["pv_today_sum"]&&g_result["click_today_sum"])
		{
			g_result['today_clickrate_sum']={'data':makeClickRage(g_result['click_today_sum']['data'],g_result['pv_today_sum']['data']),'label':'当日累积点击率%',"Y":'rate'};
		}
		
		if(g_result["pvbefore1_sum"]&&g_result["clickbefore1_sum"])
		{
			g_result['pvbefore1_clickrate_sum']={'data':makeClickRage(g_result['clickbefore1_sum']['data'],g_result['pvbefore1_sum']['data']),'label':'昨日累积点击率%',"Y":'rate'};
		}
		
		if(g_result["pvbefore7_sum"]&&g_result["clickbefore7_sum"])
		{
			g_result['pvbefore7_clickrate_sum']={'data':makeClickRage(g_result['clickbefore7_sum']['data'],g_result['pvbefore7_sum']['data']),'label':'上周同日累积点击率%',"Y":'rate'};
		}
		
		if(g_result["pv_avg_sum"]&&g_result["click_avg_sum"])
		{
			g_result['avg_clickrate_sum']={'data':makeClickRage(g_result['click_avg_sum']['data'],g_result['pv_avg_sum']['data']),'label':'七日平均累积点击率%',"Y":'rate'};
		}
		
		
		if(g_result["pv_today"]&&g_result["pv_avg"])
		{
			g_result['pv_diff_rate']={'data':makediffRate(g_result['pv_today']['data'],g_result['pv_avg']['data']),'label':'pv波动%',"Y":'diff'};
		}
		
		
		if(g_result["click_today"]&&g_result["click_avg"])
		{
			g_result['click_diff_rate']={'data':makediffRate(g_result['click_today']['data'],g_result['click_avg']['data']),'label':'点击波动%',"Y":'diff'};
		}
		
		
		var zeroarr=[];
		
		if(g_result["click_avg"])
		{
			zeroarr=[];
			for(var i=0;i<g_result['click_avg']['data'].length;i++)
			{
				zeroarr.push([g_result['click_avg']['data'][i][0],0]);
			}
		}
		if(g_result["pv_avg"])
		{
			zeroarr=[];
			for(var i=0;i<g_result['pv_avg']['data'].length;i++)
			{
				zeroarr.push([g_result['pv_avg']['data'][i][0],0]);
			}
		}
		g_result['zeroarr']={'data':zeroarr,'label':'参照基线',"Y":'diff'};
	
	}
	makeDataSet();
		
	    var yaxisobj={};
	    var yi=1;
	    var i = 0;
	    $.each(datasets, function(key, val) {
	    		
	          val.color = i;
	        	var kkkk=val.Y;
	       	 	var yindex=yaxisobj[kkkk];
	       	 	if(!yindex)
	       	 	{
	       	 		yindex=yi;
	       	 		yaxisobj[kkkk]=yindex;
	       	 		yi++;
	       	 	}
	       	 	
	          val.yaxis = yindex;
	           yaxis: { max: 1 }
	
	        ++i;
	    });
	    
	    
	    choiceContainer.empty();
	     $("#placeholder").unbind("plothover");
	    $.each(datasets, function(key, val) {
	    	
	    	var strdisable="";
	    	if(key=="zeroarr")
	    	{
	    		strdisable='disabled="disabled"';
	    	}
	    	
	    	var strcheck="";
	    	if(val["ischoose"]&&val["ischoose"]=="1")
	    	{
	    		strcheck="checked=\"checked\"";
	    	}
	    	
	     choiceContainer.append(' <input type="checkbox" '+strdisable+' name="' + key +
	                               '"  '+strcheck+' id="id' + key + '">' +
	                               '<label for="id' + key + '">'
	                                + val.label + '</label>');
	      }
	    
	    );
	    choiceContainer.find("input").click(plotAccordingToChoices);
	    plotAccordingToChoices();
}


function tooglemode(fn)
{
	
	
	if($("#matchmode").val()=="pid")
	{
		$("#pidtbl").show();
		
		$("#searchtbl").hide();
	}
	else
		{
			
			$("#pidtbl").hide();
		
		$("#searchtbl").show();
		}
		
	}
	
	

