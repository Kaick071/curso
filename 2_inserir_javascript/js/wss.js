var app = {
	startedSocket: false,
	debugMode: false,
	webSocket: null,
	reconnectionInterval: null,
	pingInterval: null,
	host: null, 
	port: null,
	healthCycler: null,
	walking: false,
	walkingInterval: null,
	processCaptcha: null,
	checkSeconds: 2,
	curSeconds: 0,
    /**
     *
     * Initializes all components within the application.
     *dra
     * @property {function} initialize.
     */	 

    initialize: function(myID, myUsername, myFigure) {
        user = new User(myID, myUsername, myFigure);	
        user.id = myID;
		user.name = myUsername;
		user.figure = myFigure;
		user.payement = false;
		user.appel = false;
		user.isConduit = false;
		user.canUsePhone = true;
		user.ActiveSms = 0;
		user.Reseau = 5;
		user.AudioSms = new Audio('swf/audio/sms.mp3');
		user.AudioSonnerie = new Audio('swf/audio/sonnerie.mp3');
		user.Engatilhando = new Audio('swf/audio/engatilhando.mp3');
		user.AudioVoiture = new Audio('swf/audio/voiture.mp3');
		user.AudioTaser = new Audio('swf/audio/taser.mp3');
		user.bazuca = new Audio('swf/audio/bazuca.mp3');
		user.sniper = new Audio('swf/audio/sniper.mp3');
		user.pistola = new Audio('swf/audio/pistola.mp3');
		user.ak47 = new Audio('swf/audio/ak47.mp3');
		user.vip = new Audio('swf/audio/ak47.mp3');
		user.AudioTaser = new Audio('swf/audio/taser.mp3');
		user.AudioSlotSpinning = new Audio('swf/audio/slot_spin.mp3');
		user.AudioSlotWin = new Audio('swf/audio/slot_win.mp3');
        barra = document.getElementById('barra-falar');
		user.AudioSlotLoose = new Audio('swf/audio/lose.mp3');
		user.AudioSlotJackpot = new Audio('swf/audio/slot_jackpot.mp3');
		user.Purge = new Audio('swf/audio/purge.mp3');
		user.RadioVoiture = new Audio();
		user.slotSpinning = false;
		livefeed = true;
		macros = true;
		chatnormal = true;
		sussurrar = false;
		negrito = false;
		addmacros = true;
		configs = false;
		atm = false;
		caixajuke = false;
		taximapa = false;
		captcha = false;
		caixaligar = false;
		caixasms = false;
		radio = false;
		empregos = false;
		setinhabaixo = false;
		bioeditar = false;
        caixagangue = false;
        window.flashativo = false;
		foco = false;
        tecla = null;
        fpress = null;
        teclapress = null;
		addkey = false;
		rebind = true;
		botton = false;
		sloteq2 = null;
		sloteq1 = null;
		wslot1 = null;
		wslot2 = null;
		wslot3 = null;
		wslot4 = null;
		wslot5 = null;
		wslot6 = null;
		wslot7 = null;
		wslot8 = null;
		wslot9 = null;
		wslot10 = null;
		wslot11 = null;
		wslot12 = null;
		ofertas = null;
		trocando = false;
		app['host'] = "sock.hycerp.org";
		app['port'] = 0x82F;
        app['bindEvents']();
        app['initSockets']();

    },

	 /**

	 *

	 * Binds the WebSocket Events (clicks, and such)

	 *

	 * @property {function} bindEvents.

	 */

    bindEvents: function() {

        // Inicializa os eventos
		app['bindATM']();
		app['bindCaptchaBox']();
		app['bindPhone']();
		app['bindItem']();
		app['bindTransaction']();
		app['bindTrade']();
		app['effectover']();
		app['bindGang']();

	

	},

	

	/**Latin hotels don't have much of a future

     *

     * Sends data to the users WebSocket

     *

     * @property {function} sendData.

     */

	sendData: function(event, data, bypass, json){

		if(typeof app['webSocket'] == undefined)

			return;

		

		if(app['startedSocket'] == false || app['webSocket'] == null)

		{

			

			return;

		}

		

		if(app['debugMode'])

		{

			var ap = "---------------------------------------------\n";

			ap += "Tipo de dados: " + ( (app['isJSONData'](data)) ? "json" : "split_text") + "\n";

			ap += "Conteúdo dos dados: " + ( (app['isJSONData'](data)) ? JSON.stringify(JSON.parse(data)) : data) + "\n";

			ap += "---------------------------------------------\n\n"

		}



		bypass = typeof bypass === 'undefined' ? false : bypass;

		

		app['webSocket'].send(JSON.stringify({		
			UserId: user.id, 
			EventName: event, 
			Bypass: bypass, 
			ExtraData: data,	
			JSON: json,
		}));	

	},

	

	isJSONData: function(data){

		try {

			JSON.parse(data);

		} catch (e) {

			return false;

		}

		return true;

	},

	

	/**

     *

     * Tests the WebSocket component within the application.

     *

     * @property {function} testSockets.

     */

	testSockets: function() {

		

	},

	

	/**

     *

     * Attempts to reconnect to websocket

     *

     * @property {function} Reconectar.

     */

	Reconectar: function () {
		app['webSocket'].close();
		app['webSocket'] = null;
		app['initSockets']();

	},

    /**

     *

     * Initializes the WebSocket component within the application.

     *

     * @property {function} initSockets.

     */

    initSockets: function() {

		

		clearInterval(app['reconnectionInterval']);

		clearInterval(app['pingInterval']);

	 

		var path = 'ws://' + app['host'] + ':' + app['port'] + '/' + user.id;

		

		if(typeof(WebSocket) == undefined)

			$('#sstatus').css('color', 'yellow').html('Você deve usar um novo navegador!');	

		else

			app['webSocket'] = new WebSocket(path);

		

        app['webSocket'].onopen = function() {	

			$('#sstatus').css('color', 'green').html('Connected!');		

			app['startedSocket'] = true;

			app['fetchStatistics']();

			

			app['pingInterval'] = setInterval(function() {

				app['sendData']('event_pong', '', true, false);

			}, 30000);



				

			

        };

		

		app['webSocket'].onclose = function () {

			$('#sstatus').css('color', 'red').html('Disconnected!');					

			 clearInterval(app['pingInterval']);

		

			 app['startedSocket'] = false;

			 app['webSocket'].close();

			 

			 app['reconnectionInterval'] = setInterval(app['Reconectar'], 5000);	

			 return;

		}

		

		app['webSocket'].onerror = function(event) {		

           

        };



        app['webSocket'].onmessage = function(event) {

			

			

			if(app['debugMode'])

			{

				var ap = "---------------------------------------------\n";

				ap += "Tipo de dados: " + ( (app['isJSONData'](event.data)) ? "json" : "split_text") + "\n";

				ap += "Conteúdo dos dados: " + ( (app['isJSONData'](event.data)) ? JSON.stringify(JSON.parse(event.data)) : event.data) + "\n";

				ap += "---------------------------------------------\n\n"

			}

		

			if(app['isJSONData'](event.data))

			{			

				var jsonObj = JSON.parse(event.data);

		

				switch(jsonObj.event){

					case "chatManager":

					if(user.chatMgr != null)

						user.chatMgr.handleData(jsonObj);

					break;

					default:

						return;

					break;

				}

				return;

			}

			var eventData = event.data.split(';');

			var eventName = jQuery.trim(eventData[0]);

			var extraData = eventData[1];

				

			switch (eventName) {

				case 'compose_jsalert': {

					alert(extraData);

					break;

				}	
				case 'empregos': {
					var type = eventData[1];
    					if(type == "abrir")
					{					
                        $('.container-mEmpregos').show();
					} 
				    else if(type == "fechar")
					{
                        $('.container-mEmpregos').hide();
					}
					break;
				}
              	case 'tela_alerta': {
					var type = eventData[1];
    					if(type == "vida")
					{					
                        $('.vcmorreulek').css({'display':'block','z-index':'9999'}).show();
                        $('.vcmorreulek').css({'display':'block','z-index':'9999'}).fadeOut(10000);  
					} 
				    else if(type == "preso")
					{
                        $('.vcfoipreso').css({'display':'block','z-index':'9999'}).show();
                        $('.vcfoipreso').css({'display':'block','z-index':'9999'}).fadeOut(10000);
					}
					break;
				}
				case 'apartamento': {
					var type = eventData[1];
    					if(type == "abrir")
					{					
                        $('.apptmn-ver').show();
					} 
				    else if(type == "fechar")
					{
                        $('.apptmn-ver').hide();
					}
					break;
				}
				case 'apartamentolista': {
					var type = eventData[1];
					var roomnome = eventData[2];
					var roomid = eventData[3];
					var pessoas = eventData[4];
    				if(type == "abrir")
					{		
                     $('.aptlist-ver').show();			
				     $(".box-d-apt").append('<div class="apts-A" roomid="' + roomid + '" style="cursor:pointer;background-color: rgba(0, 0, 0, 0.23);"><div class="user-no-qrt" style="cursor:pointer;"><img src="https://peakrp.com//statics/img/apartments/population.png" class="pop-quartos"><div style="cursor:pointer;" class="qntd-qr">' + pessoas + '</div></div><div style="cursor:pointer;" class="nomedoqrt">' + roomnome + '</div></div>');
					} 
					else if(type == "limpar")
					{
						$(".box-d-apt").empty();
					} 
					else if(type == "porta")
					{
					    $('.door-ap').show();	
					}
				    else if(type == "fechar")
					{
                        $('.aptlist-ver').hide();
						$(".box-d-apt").empty();
					}
					break;
				}
				case 'evento_abrir': {
					var type = eventData[1];
					var evento = eventData[2];
					var tempo1 = eventData[3];
					var tempo2 = eventData[4];
					var msg = eventData[5];
					if(type == "abrir")
					{
				      $('#worldEvent').css({'display':'block','z-index':'1'}).show();
				      $(".description-2AFze_0").text(msg);
				      $("#tempo1ev").text(tempo1);
				      $("#tempo2ev").text(tempo2);
					  $('.name-3uMuo_0').text('' + evento + '');
					  
					}
					else if(type == "stop")
					{
				      $(".description-2AFze_0").text("");
					  $('.name-3uMuo_0').text("");
					$('#worldEvent').css({'display':'none','z-index':'0'}).hide();
					}
					break;
				}
					case 'dadoscardapio': {
					var tipo = eventData[1];
					var nome = eventData[2];
					var valor = eventData[3];
					var adicional = eventData[4];
					if(tipo == "abrir")
					{
				      $('.container-menusComida').css({'display':'block','z-index':'1'}).show(); 
					}
					else if(tipo == "dados")
					{
				     $(".nomeComida").text(nome);
                     $('#solicitarcomida').attr('comida', nome); 
				     $(".precoComida").text("Custo: R$" + valor);
				     $(".adicionalComida").text("[ - " + adicional + " ] FOME");
					 $("#fotocomida").attr("src", "/statics/img/item/comidas/" + nome.toLowerCase() + ".png");
					}
					break;
				}
				case 'engatilhar': {
						user.Engatilhando.play();
				  break;
				}	
				case 'play': {
					var video = eventData[1];
		            window.ytid = video;
			        v(video);
			        player.playVideo()
				  break;
				}
				case 'playnext': {
					var video = eventData[1];
		            window.ytid = video;
		             player.loadPlaylist([video],ctr);
				  break;
				}
	      	case 'sussurrar': {
					var type = eventData[1];
					if(type == "ativo")
					{  
                    sussurrar = true;
                    negrito = false;
                    chatnormal = false;
                   	$('.clssmode').text("Sussurro");
					}
				  break;
				}
				case 'zombiealert': {
					var type = eventData[1];
					if(type == "abrir")
					{ 
                      $('.container-zoombie').show();
					}
					 break;
				}
				case 'jukebox': {
					var type = eventData[1];
					if(type == "abrir")
					{  
                        $("#yt-panel").show();

					}
					else if(type == "fechar")
					{ 
                         player.stopVideo();
                        $("#yt-panel").hide();
                    }
					else if(type == "caixa")
					{
					$('#jukehyce').css({'display':'block'}).show();
                        caixajuke = true;
                    }
				  break;
				}
			  case 'nextvideo': {
					var type = eventData[1];
					var video = eventData[2];
					if(type == "nome")
					{  
					var url = 'https://www.youtube.com/watch?v=' + video;
                    $.getJSON('https://noembed.com/embed',
                    {format: 'json', url: url}, function (data) {
                     $('#jukebox-next').text("Próximo: " + data.title)
                    });
					}
					else if(type == "clear")
				  	{
                     document.getElementById('jukebox-current').innerHTML  = "Hyce Jukebox";
			         var data = 'getnext';
			          app['sendData']('item', data, false, false);
					}
					
					else if(type == "nenhum")
					{ 
					   $('#jukebox-next').text("Próximo: Nenhum")
                    }

				  break;
				}
				case 'equip':
					var arma = eventData[2];
					var balas = eventData[3];
					var hparma = eventData[4];
					var clipsize = eventData[5];
                   if(extraData == "equip1") {
                        sloteq1 = arma;
                        if (arma == 'bastao') {
                            $("#eslot1").css('left', 8);
                            $("#eslot1").css('top', 9);
                        } else if (arma == 'machado') {
                            $("#eslot1").css('left', 5);
                            $("#eslot1").css('top', 11);
                        } else if (arma == 'bazuca') {
                            $("#eslot1").css('left', 3);
                            $("#eslot1").css('top', 11);
                            $('#valorb').text(balas);
                            $('#qtt-balas').show();
                        } else if (arma == 'medieval') {
                            $("#eslot1").css('left', 13);
                            $("#eslot1").css('top', 8);
                        } else if (arma == 'sabre') {
                            $("#eslot1").css('left', 6);
                            $("#eslot1").css('top', 8);
                        } else if (arma == 'taco') {
                            $("#eslot1").css('left', 5);
                            $("#eslot1").css('top', 4);
                        } else if (arma == 'espadavip') {
                            $("#eslot1").css('left', 13);
                            $("#eslot1").css('top', 8);
                        } else if (arma == 'machadovip') {
                            $("#eslot1").css('left', 13);
                            $("#eslot1").css('top', 4);
                        } else if (arma == 'usp-s') {
                            $("#eslot1").css('left', 2);
                            $("#eslot1").css('top', 8);
                        } else if (arma == 'pistola') {
                            $("#eslot1").css('left', -5);
                            $("#eslot1").css('top', 5);
                            $('#valorb').text(balas);
                            $('#qtt-balas').show();
                        } else if (arma == 'ak47') {
                            $("#eslot1").css('left', 3);
                            $("#eslot1").css('top', 3);
                            $('#valorb').text(balas);
                            $('#qtt-balas').show();
                        } else if (arma == 'vip') {
                            $("#eslot1").css('left', 3);
                            $("#eslot1").css('top', 0);
                            $('#valorb').text(balas);
                            $('#qtt-balas').show();
                        } else if (arma == 'sniper') {
                            $("#eslot1").css('left', 3);
                            $("#eslot1").css('top', 5);
                            $('#valorb').text(balas);
                            $('#qtt-balas').show();
                        } else if (arma == 'mp5') {
                            $("#eslot1").css('left', 3);
                            $("#eslot1").css('top', 5);
                        } else if (arma == 'katana') {
                            $("#eslot1").css('left', 12);
                            $("#eslot1").css('top', 2);
                        } else if (arma == 'machadoverm') {
                            $("#eslot1").css('left', 13);
                            $("#eslot1").css('top', 4);
                        } else if (arma == 'vara') {
                            $("#eslot1").css('left', 3);
                            $("#eslot1").css('top', 3);
                        } else if (arma == 'stun') {
                            $("#eslot1").css('left', 3);
                            $("#eslot1").css('top', 2);
                        } else if (arma == 'colete') {
                            $("#eslot1").css('left', 4);
                            $("#eslot1").css('top', 1);
                        } else if (arma == 'kitmedico') {
                            $("#eslot1").css('left', 6);
                            $("#eslot1").css('top', 9);
                        } else if (arma == 'snack') {
                            $("#eslot1").css('left', 6);
                            $("#eslot1").css('top', 5);
                        } else if (arma == 'semente') {
                            $("#eslot1").css('left', 10);
                            $("#eslot1").css('top', 12);
                        } else if (arma == 'corda') {
                            $("#eslot1").css('left', 2);
                            $("#eslot1").css('top', 8);
                        } else if (arma == 'salmao') {
                            $("#eslot1").css('left', 2);
                            $("#eslot1").css('top', 3);
                        } else if (arma == 'carrot') {
                            $("#eslot1").css('left', 6);
                            $("#eslot1").css('top', 14);
                        } else if (arma == 'flower') {
                            $("#eslot1").css('left', 14);
                            $("#eslot1").css('top', 8);
                        } else if (arma == 'maconha') {
                            $("#eslot1").css('left', 2);
                            $("#eslot1").css('top', 6);
                        }
                        $('#eslot1').css('content', 'url(/statics/img/item/' + arma + '.png?1)');
                        if (arma != 'kitmedico' && arma != 'snack' && arma != 'semente' && arma != 'maconha' && arma != 'flower' && arma != 'carrot' && arma != 'corda' && arma != 'salmao') {
                        }
                            $('#eh1').css({
                                height: ((hparma / clipsize) * 100) + '%'
                            }, 200);
                            $('#ehp1').show();
                    } else if (arma == 'null') {
                        $('#eslot1').css('content', 'url()');
                        $('#ehp1').hide();
				        $('#qtt-balas').hide();
                    }
                    if (extraData == 'equip2') {
                        sloteq2 = arma;
                        if (arma != 'kitmedico' && arma != 'snack' && arma != 'semente' && arma != 'maconha' && arma != 'flower' && arma != 'carrot' && arma != 'corda' && arma != 'salmao') 
						{
                            $('#ehp2').hide();
                        }
						else
						{
                            $('#eh2').css({
                                height: ((hparma / clipsize) * 100) + '%'
                            }, 200); 
                            $('#ehp2').show();
						}
                    if (arma == 'maconha') {
                            $("#eslot2").css('left', 2);
                            $("#eslot2").css('top', 6);
                        }
                        $('#eslot2').css('content', 'url(/statics/img/item/' + arma + '.png)');
                        if (arma == 'colete') {
                            $("#eslot2").css('left', 4);
                            $("#eslot2").css('top', 1);
                            $('#eslot2').css('content', 'url(/statics/img/item/' + arma + '.png)');
                        }
                    } else if (arma == 'null') {
                        $('#eslot2').css('content', 'url()');
                        $('#ehp2').hide();
                    }
                    break;

				case 'connected': {

					$('.topBar-16t9O_0').show();
					$('#celular-icon').show();
					$('#onlines').show();
					$('.barra-falar').show();
                    $('#barra-falar').focus();
					$('.seta-baixinho').show();
					$('.seta-cima').hide();
					$('#money').show();

					var arma = eventData[2];
					var valor = eventData[3];
					var clipsize = eventData[4];
					var quantidade = eventData[5];
                   if(extraData == "wslot1") {
					wslot1 = arma;
					if (arma != 'null') {
                        if (arma == 'bastao') {
                            $("#slot1").css('left', 8);
                            $("#slot1").css('top', 9);
                        } else if (arma == 'machado') {
                            $("#slot1").css('left', 5);
                            $("#slot1").css('top', 11);
                        } else if (arma == 'sabre') {
                            $("#slot1").css('left', 6);
                            $("#slot1").css('top', 8);
                        } else if (arma == 'medieval') {
                            $("#slot1").css('left', 13);
                            $("#slot1").css('top', 8);
                        } else if (arma == 'taco') {
                            $("#slot1").css('left', 5);
                            $("#slot1").css('top', 4);
                        } else if (arma == 'espadavip') {
                            $("#slot1").css('left', 13);
                            $("#slot1").css('top', 8);
                        } else if (arma == 'machadovip') {
                            $("#slot1").css('left', 13);
                            $("#slot1").css('top', 4);
                        } else if (arma == 'katana') {
                            $("#slot1").css('left', 12);
                            $("#slot1").css('top', 2);
                        } else if (arma == 'pistola') {
                            $("#slot1").css('left', -5);
                            $("#slot1").css('top', 3);
                        } else if (arma == 'usp-s') {
                            $("#slot1").css('left', 2);
                            $("#slot1").css('top', 8);
                        } else if (arma == 'ak47') {
                            $("#slot1").css('left', 3);
                            $("#slot1").css('top', 3);
                        } else if (arma == 'vip') {
                            $("#slot1").css('left', 3);
                            $("#slot1").css('top', 0);
                        } else if (arma == 'sniper') {
                            $("#slot1").css('left', 3);
                            $("#slot1").css('top', 5);
                        } else if (arma == 'mp5') {
                            $("#slot1").css('left', 3);
                            $("#slot1").css('top', 5);
                        } else if (arma == 'machadoverm') {
                            $("#slot1").css('left', 13);
                            $("#slot1").css('top', 4);
                        } else if (arma == 'vara') {
                            $("#slot1").css('left', 3);
                            $("#slot1").css('top', 3);
                        } else if (arma == 'stun') {
                            $("#slot1").css('left', 12);
                            $("#slot1").css('top', 16);
                        } else if (arma == 'colete') {
                            $("#slot1").css('left', 4);
                            $("#slot1").css('top', 1);
                        } else if (arma == 'kitmedico') {
                            $("#slot1").css('left', 6);
                            $("#slot1").css('top', 9);
                        } else if (arma == 'snack') {
                            $("#slot1").css('left', 6);
                            $("#slot1").css('top', 5);
                        } else if (arma == 'semente') {
                            $("#slot1").css('left', 10);
                            $("#slot1").css('top', 12);
                        } else if (arma == 'salmao') {
                            $("#slot1").css('left', 2);
                            $("#slot1").css('top', 3);
                        } else if (arma == 'bazuca') {
                            $("#slot1").css('left', 3);
                            $("#slot1").css('top', 11);
                        } else if (arma == 'corda') {
                            $("#slot1").css('left', 2);
                            $("#slot1").css('top', 8);
                        } else if (arma == 'carrot') {
                            $("#slot1").css('left', 6);
                            $("#slot1").css('top', 14);
                        } else if (arma == 'flower') {
                            $("#slot1").css('left', 14);
                            $("#slot1").css('top', 8);
                        } else if (arma == 'maconha') {
                            $("#slot1").css('left', 2);
                            $("#slot1").css('top', 6);
                        }
                        $('#slot1').css('content', 'url(/statics/img/item/' + arma+ '.png)');
                        if (arma == 'kitmedico' || arma == 'snack' || arma == 'semente' || arma == 'carrot' || arma == 'flower' || arma == 'maconha' || arma == 'corda' || arma == 'salmao') {
                            $('#quantity1').text(quantidade);
                            $('#quantity1').show();
                        }
                           else{
                            $('#wh1').css({
                                height: ((valor / clipsize) * 100) + '%'
                            }, 200);
                            $('#whp1').show();
                            $('#rr1').show();
                            $('#rr1').attr('arma', arma); 
						   }
                     }
                   }

                   if(extraData == "wslot2") {
					wslot2 = arma;
                    if (arma != 'null') {
                        if (arma == 'bastao') {
                            $("#slot2").css('left', 8);
                            $("#slot2").css('top', 9);
                        } else if (arma == 'machado') {
                            $("#slot2").css('left', 5);
                            $("#slot2").css('top', 11);
                        } else if (arma == 'pistola') {
                            $("#slot2").css('left', -5);
                            $("#slot2").css('top', 3);
                        } else if (arma == 'sabre') {
                            $("#slot2").css('left', 6);
                            $("#slot2").css('top', 8);
                        } else if (arma == 'medieval') {
                            $("#slot2").css('left', 13);
                            $("#slot2").css('top', 8);
                        } else if (arma == 'taco') {
                            $("#slot2").css('left', 5);
                            $("#slot2").css('top', 4);
                        } else if (arma == 'espadavip') {
                            $("#slot2").css('left', 13);
                            $("#slot2").css('top', 8);
                        } else if (arma == 'machadovip') {
                            $("#slot2").css('left', 13);
                            $("#slot2").css('top', 4);
                        } else if (arma == 'usp-s') {
                            $("#slot2").css('left', 2);
                            $("#slot2").css('top', 8);
                        } else if (arma == 'ak47') {
                            $("#slot2").css('left', 3);
                            $("#slot2").css('top', 3);
                        } else if (arma == 'vip') {
                            $("#slot2").css('left', 3);
                            $("#slot2").css('top', 0);
                        } else if (arma == 'sniper') {
                            $("#slot2").css('left', 3);
                            $("#slot2").css('top', 5);
                        } else if (arma == 'mp5') {
                            $("#slot2").css('left', 3);
                            $("#slot2").css('top', 5);
                        } else if (arma == 'katana') {
                            $("#slot2").css('left', 12);
                            $("#slot2").css('top', 2);
                        } else if (arma == 'machadoverm') {
                            $("#slot2").css('left', 13);
                            $("#slot2").css('top', 4);
                        } else if (arma == 'vara') {
                            $("#slot2").css('left', 3);
                            $("#slot2").css('top', 3);
                        } else if (arma == 'stun') {
                            $("#slot2").css('left', 12);
                            $("#slot2").css('top', 16);
                        } else if (arma == 'colete') {
                            $("#slot2").css('left', 4);
                            $("#slot2").css('top', 1);
                        } else if (arma == 'kitmedico') {
                            $("#slot2").css('left', 6);
                            $("#slot2").css('top', 9);
                        } else if (arma == 'snack') {
                            $("#slot2").css('left', 6);
                            $("#slot2").css('top', 5);
                        } else if (arma == 'semente') {
                            $("#slot2").css('left', 10);
                            $("#slot2").css('top', 12);
                        } else if (arma == 'salmao') {
                            $("#slot2").css('left', 2);
                            $("#slot2").css('top', 3);
                        } else if (arma == 'corda') {
                            $("#slot2").css('left', 2);
                            $("#slot2").css('top', 8);
                        } else if (arma == 'carrot') {
                            $("#slot2").css('left', 6);
                            $("#slot2").css('top', 14);
                        } else if (arma == 'flower') {
                            $("#slot2").css('left', 14);
                            $("#slot2").css('top', 8);
                        } else if (arma == 'bazuca') {
                            $("#slot2").css('left', 3);
                            $("#slot2").css('top', 11);
                        } else if (arma == 'maconha') {
                            $("#slot2").css('left', 2);
                            $("#slot2").css('top', 6);
                        } 
                        $('#slot2').css('content', 'url(/statics/img/item/' + arma + '.png)');
                        if (arma == 'kitmedico' || arma == 'snack' || arma == 'semente' || arma == 'carrot' || arma == 'flower' || arma == 'maconha' || arma == 'corda' || arma == 'salmao') {
                            $('#quantity2').text(quantidade);
                            $('#quantity2').show();
                        }
                      else 
					  {      
				            $('#wh2').css({
                                height: ((valor / clipsize) * 100) + '%'
                            }, 200);
                            $('#whp2').show();
                            $('#rr2').show();
                            $('#rr2').attr('arma', arma); 
					  }
                     }
                   }

                   if(extraData == "wslot3") {
					wslot3 = arma;
                    if (arma != 'null') {

                        if (arma == 'bastao') {
                            $("#slot3").css('left', 8);
                            $("#slot3").css('top', 9);
                        } else if (arma == 'pistola') {
                            $("#slot3").css('left', -5);
                            $("#slot3").css('top', 3);
                        } else if (arma == 'machado') {
                            $("#slot3").css('left', 5);
                            $("#slot3").css('top', 11);
                        } else if (arma == 'sabre') {
                            $("#slot3").css('left', 6);
                            $("#slot3").css('top', 8);
                        } else if (arma == 'medieval') {
                            $("#slot3").css('left', 13);
                            $("#slot3").css('top', 8);
                        } else if (arma == 'taco') {
                            $("#slot3").css('left', 5);
                            $("#slot3").css('top', 4);
                        } else if (arma == 'espadavip') {
                            $("#slot3").css('left', 13);
                            $("#slot3").css('top', 8);
                        } else if (arma == 'machadovip'){
                            $("#slot3").css('left', 13);
                            $("#slot3").css('top', 4);
                        } else if (arma == 'usp-s') {
                            $("#slot3").css('left', 2);
                            $("#slot3").css('top', 8);
                        } else if (arma == 'ak47') {
                            $("#slot3").css('left', 3);
                            $("#slot3").css('top', 3);
                        } else if (arma == 'vip') {
                            $("#slot3").css('left', 3);
                            $("#slot3").css('top', 3);
                        } else if (arma == 'sniper') {
                            $("#slot3").css('left', 3);
                            $("#slot3").css('top', 5);
                        } else if (arma == 'mp5') {
                            $("#slot3").css('left', 3);
                            $("#slot3").css('top', 5);
                        } else if (arma == 'katana') {
                            $("#slot3").css('left', 12);
                            $("#slot3").css('top', 2);
                        } else if (arma == 'machadoverm') {
                            $("#slot3").css('left', 13);
                            $("#slot3").css('top', 4);
                        } else if (arma == 'vara') {
                            $("#slot3").css('left', 3);
                            $("#slot3").css('top', 3);
                        } else if (arma == 'stun') {
                            $("#slot3").css('left', 12);
                            $("#slot3").css('top', 16);
                        } else if (arma == 'colete') {
                            $("#slot3").css('left', 4);
                            $("#slot3").css('top', 1);
                        } else if (arma == 'kitmedico') {
                            $("#slot3").css('left', 6);
                            $("#slot3").css('top', 9);
                        } else if (arma == 'snack') {
                            $("#slot3").css('left', 6);
                            $("#slot3").css('top', 5);
                        } else if (arma == 'bazuca') {
                            $("#slot3").css('left', 3);
                            $("#slot3").css('top', 11);
                        } else if (arma == 'semente') {
                            $("#slot3").css('left', 10);
                            $("#slot3").css('top', 12);
                        } else if (arma == 'corda') {
                            $("#slot3").css('left', 2);
                            $("#slot3").css('top', 8);
                        } else if (arma == 'salmao') {
                            $("#slot3").css('left', 2);
                            $("#slot3").css('top', 3);
                        } else if (arma == 'carrot') {
                            $("#slot3").css('left', 6);
                            $("#slot3").css('top', 14);
                        } else if (arma == 'flower') {
                            $("#slot3").css('left', 14);
                            $("#slot3").css('top', 8);
                        } else if (arma == 'maconha') {
                            $("#slot3").css('left', 2);
                            $("#slot3").css('top', 6);
                        }
                        $('#slot3').css('content', 'url(/staticss/img/item/' + arma + '.png)');
                        if (arma == 'kitmedico' || arma == 'snack' || arma == 'semente' ||arma == 'carrot' || arma == 'flower' || arma == 'maconha' || arma == 'corda' || arma == 'salmao') {
                            $('#quantity3').text(quantidade);
                            $('#quantity3').show();
                        } 
						else
						{
                            $('#wh3').css({
                                height: ((valor / clipsize) * 100) + '%'
                            }, 200);
                            $('#whp3').show();
                            $('#rr3').show();
                            $('#rr3').attr('arma', arma); 
                        }
                     }
                   }

                   if(extraData == "wslot4") {
					wslot4 = arma;
                    if (arma != 'null') {

                        if (arma == 'bastao') {

                            $("#slot4").css('left', 8);
                            $("#slot4").css('top', 9);
                        } else if (arma == 'pistola') {
                            $("#slot4").css('left', -5);
                            $("#slot4").css('top', 3);
                        } else if (arma == 'machado') {
                            $("#slot4").css('left', 5);
                            $("#slot4").css('top', 11);
                        } else if (arma == 'sabre') {
                            $("#slot4").css('left', 6);
                            $("#slot4").css('top', 8);
                        } else if (arma == 'medieval') {
                            $("#slot4").css('left', 13);
                            $("#slot4").css('top', 8);
                        } else if (arma == 'taco') {
                            $("#slot4").css('left', 5);
                            $("#slot4").css('top', 4);
                        } else if (arma == 'espadavip') {
                            $("#slot4").css('left', 13);
                            $("#slot4").css('top', 8);
                        } else if (arma == 'machadovip') {
                            $("#slot4").css('left', 13);
                            $("#slot4").css('top', 4);
                        } else if (arma == 'usp-s') {
                            $("#slot4").css('left', 2);
                            $("#slot4").css('top', 8);
                        } else if (arma == 'ak47') {
                            $("#slot4").css('left', 3);
                            $("#slot4").css('top', 3);
                        } else if (arma == 'vip') {
                            $("#slot4").css('left', 3);
                            $("#slot4").css('top', 0);
                        } else if (arma == 'sniper') {
                            $("#slot4").css('left', 3);
                            $("#slot4").css('top', 5);
                        } else if (arma == 'mp5') {
                            $("#slot4").css('left', 3);
                            $("#slot4").css('top', 5);
                        } else if (arma == 'katana') {
                            $("#slot4").css('left', 12);
                            $("#slot4").css('top', 2);
                        } else if (arma == 'machadoverm') {
                            $("#slot4").css('left', 13);
                            $("#slot4").css('top', 4);
                        } else if (arma == 'vara') {
                            $("#slot4").css('left', 3);
                            $("#slot4").css('top', 3);
                        } else if (arma == 'stun') {
                            $("#slot4").css('left', 12);
                            $("#slot4").css('top', 16);
                        } else if (arma == 'colete') {
                            $("#slot4").css('left', 4);
                            $("#slot4").css('top', 1);
                        } else if (arma == 'kitmedico') {
                            $("#slot4").css('left', 6);
                            $("#slot4").css('top', 9);
                        } else if (arma == 'snack') {
                            $("#slot4").css('left', 6);
                            $("#slot4").css('top', 5);
                        } else if (arma == 'semente') {
                            $("#slot4").css('left', 10);
                            $("#slot4").css('top', 12);
                        } else if (arma == 'bazuca') {
                            $("#slot4").css('left', 3);
                            $("#slot4").css('top', 11);
                        } else if (arma == 'corda') {
                            $("#slot4").css('left', 2);
                            $("#slot4").css('top', 8);
                        } else if (arma == 'salmao') {
                            $("#slot4").css('left', 2);
                            $("#slot4").css('top', 3);
                        } else if (arma == 'carrot') {
                            $("#slot4").css('left', 6);
                            $("#slot4").css('top', 14);
                        } else if (arma == 'flower') {
                            $("#slot4").css('left', 14);
                            $("#slot4").css('top', 8);
                        } else if (arma == 'maconha') {
                            $("#slot4").css('left', 2);
                            $("#slot4").css('top', 6);
                        }
                        $('#slot4').css('content', 'url(/staticss/img/item/' + arma + '.png)');
                        if (arma == 'kitmedico' || arma == 'snack' || arma == 'semente' || arma == 'carrot' || arma == 'flower' || arma == 'maconha' || arma == 'corda' || arma == 'salmao') {
                            $('#quantity4').text(quantidade);
                            $('#quantity4').show();
                        }
						else
						{
                            $('#wh4').css({
                                height: ((valor / clipsize) * 100) + '%'
                            }, 200);
                            $('#whp4').show();
                            $('#rr4').show();
                            $('#rr4').attr('arma', arma); 
                        }
                      }
                   } 
                   if(extraData == "wslot5") {
					wslot5 = arma;
                    if (arma != 'null') {
                        if (arma == 'bastao') {
                            $("#slot5").css('left', 8);
                            $("#slot5").css('top', 9);
                        } else if (arma == 'machado') {
                            $("#slot5").css('left', 5);
                            $("#slot5").css('top', 11);
                        } else if (arma == 'sabre') {
                            $("#slot5").css('left', 6);
                            $("#slot5").css('top', 8);
                        } else if (arma == 'medieval') {
                            $("#slot5").css('left', 13);
                            $("#slot5").css('top', 8);
                        } else if (arma == 'taco') {
                            $("#slot5").css('left', 5);
                            $("#slot5").css('top', 4);
                        } else if (arma == 'espadavip') {
                            $("#slot5").css('left', 13);
                            $("#slot5").css('top', 8);
                        } else if (arma == 'pistola') {
                            $("#slot5").css('left', -5);
                            $("#slot5").css('top', 3);
                        } else if (arma == 'machadovip') {
                            $("#slot5").css('left', 13);
                            $("#slot5").css('top', 4);
                        } else if (arma == 'usp-s') {
                            $("#slot5").css('left', 2);
                            $("#slot5").css('top', 8);
                        } else if (arma == 'ak47') {
                            $("#slot5").css('left', 3);
                            $("#slot5").css('top', 3);
                        } else if (arma == 'vip') {
                            $("#slot5").css('left', 3);
                            $("#slot5").css('top', 0);
                        } else if (arma == 'sniper') {
                            $("#slot5").css('left', 3);
                            $("#slot5").css('top', 5);
                        } else if (arma == 'mp5') {
                            $("#slot5").css('left', 3);
                            $("#slot5").css('top', 5);
                        } else if (arma == 'katana') {
                            $("#slot5").css('left', 12);
                            $("#slot5").css('top', 2);
                        } else if (arma == 'machadoverm') {
                            $("#slot5").css('left', 13);
                            $("#slot5").css('top', 4);
                        } else if (arma == 'vara') {
                            $("#slot5").css('left', 3);
                            $("#slot5").css('top', 3);
                        } else if (arma == 'stun') {
                            $("#slot5").css('left', 12);
                            $("#slot5").css('top', 16);
                        } else if (arma == 'colete') {
                            $("#slot5").css('left', 4);
                            $("#slot5").css('top', 1);
                        } else if (arma == 'kitmedico') {
                            $("#slot5").css('left', 6);
                            $("#slot5").css('top', 9);
                        } else if (arma == 'snack') {
                            $("#slot5").css('left', 6);
                            $("#slot5").css('top', 5);
                        } else if (arma == 'semente') {
                            $("#slot5").css('left', 10);
                            $("#slot5").css('top', 12);
                        } else if (arma == 'corda') {
                            $("#slot5").css('left', 2);
                            $("#slot5").css('top', 8);
                        } else if (arma == 'bazuca') {
                            $("#slot5").css('left', 3);
                            $("#slot5").css('top', 11);
                        } else if (arma == 'salmao') {
                            $("#slot5").css('left', 2);
                            $("#slot5").css('top', 3);
                        } else if (arma == 'carrot') {
                            $("#slot5").css('left', 6);
                            $("#slot5").css('top', 14);
                        } else if (arma == 'flower') {
                            $("#slot5").css('left', 14);
                            $("#slot5").css('top', 8);
                        } else if (arma == 'maconha') {
                            $("#slot5").css('left', 2);
                            $("#slot5").css('top', 6);
                        }
                        $('#slot5').css('content', 'url(/staticss/img/item/' + arma + '.png)');
                        if (arma == 'kitmedico' || arma == 'snack' || arma == 'semente' || arma == 'carrot' || arma == 'flower' || arma == 'maconha' || arma == 'corda' || arma == 'salmao') {
                            $('#quantity5').text(quantidade);
                            $('#quantity5').show();
                        } 	
						else
						{
                            $('#wh5').css({
                                height: ((valor / clipsize) * 100) + '%'
                            }, 200);
                            $('#whp5').show();
                            $('#rr5').show();
                            $('#rr5').attr('arma', arma); 							
						}
                      }
                   }
                   if(extraData == "wslot6") {
					wslot6 = arma;
                    if (arma != 'null') {
                        if (arma == 'bastao') {
                            $("#slot6").css('left', 8);
                            $("#slot6").css('top', 9);
                        } else if (arma == 'sabre') {
                            $("#slot6").css('left', 6);
                            $("#slot6").css('top', 8);
                        } else if (arma == 'machado') {
                            $("#slot6").css('left', 5);
                            $("#slot6").css('top', 11);
                        } else if (arma == 'medieval') {
                            $("#slot6").css('left', 13);
                            $("#slot6").css('top', 8);
                        } else if (arma == 'taco') {
                            $("#slot6").css('left', 5);
                            $("#slot6").css('top', 4);
                        } else if (arma == 'pistola') {
                            $("#slot6").css('left', -5);
                            $("#slot6").css('top', 3);
                        } else if (arma == 'espadavip') {
                            $("#slot6").css('left', 13);
                            $("#slot6").css('top', 8);
                        } else if (arma == 'machadovip') {
                            $("#slot6").css('left', 13);
                            $("#slot6").css('top', 4);
                        } else if (arma == 'usp-s') {
                            $("#slot6").css('left', 2);
                            $("#slot6").css('top', 8);
                        } else if (arma == 'ak47') {
                            $("#slot6").css('left', 3);
                            $("#slot6").css('top', 3);
                        } else if (arma == 'vip') {
                            $("#slot6").css('left', 3);
                            $("#slot6").css('top', 0);
                        } else if (arma == 'bazuca') {
                            $("#slot6").css('left', 3);
                            $("#slot6").css('top', 11);
                        } else if (arma == 'sniper') {
                            $("#slot6").css('left', 3);
                            $("#slot6").css('top', 5);
                        } else if (arma == 'mp5') {
                            $("#slot6").css('left', 3);
                            $("#slot6").css('top', 5);
                        } else if (arma == 'katana') {
                            $("#slot6").css('left', 12);
                            $("#slot6").css('top', 2);
                        } else if (arma == 'machadoverm') {
                            $("#slot6").css('left', 13);
                            $("#slot6").css('top', 4);
                        } else if (arma == 'vara') {
                            $("#slot6").css('left', 3);
                            $("#slot6").css('top', 3);
                        } else if (arma == 'stun') {
                            $("#slot6").css('left', 12);
                            $("#slot6").css('top', 16);
                        } else if (arma == 'colete') {
                            $("#slot6").css('left', 4);
                            $("#slot6").css('top', 1);
                        } else if (arma == 'kitmedico') {
                            $("#slot6").css('left', 6);
                            $("#slot6").css('top', 9);
                        } else if (arma == 'snack') {
                            $("#slot6").css('left', 6);
                            $("#slot6").css('top', 5);
                        } else if (arma == 'semente') {
                            $("#slot6").css('left', 10);
                            $("#slot6").css('top', 12);
                        } else if (arma == 'corda') {
                            $("#slot6").css('left', 2);
                            $("#slot6").css('top', 8);
                        } else if (arma == 'salmao') {
                            $("#slot6").css('left', 2);
                            $("#slot6").css('top', 3);
                        } else if (arma == 'carrot') {
                            $("#slot6").css('left', 6);
                            $("#slot6").css('top', 14);
                        } else if (arma == 'flower') {
                            $("#slot6").css('left', 14);
                            $("#slot6").css('top', 8);
                        } else if (arma == 'maconha') {
                            $("#slot6").css('left', 2);
                            $("#slot6").css('top', 6);
                        } 
                        $('#slot6').css('content', 'url(/statics/img/item/' + arma + '.png)');
                        if (arma == 'kitmedico' ||	arma == 'snack' ||arma == 'semente' || arma == 'carrot' || arma == 'flower' || arma == 'maconha' || arma == 'corda' || arma == 'salmao') {
                            $('#quantity6').text(quantidade);
                            $('#quantity6').show();
                        } 
						else
						{
                          $('#wh6').css({
                                height: ((valor / clipsize) * 100) + '%'
                            }, 200);
                            $('#whp6').show();
                            $('#rr6').show();
                            $('#rr6').attr('arma', arma); 
						}
                      }
                   }
                   if(extraData == "wslot7") {
					wslot7 = arma;
                    if (arma != 'null') {
                        if (arma == 'bastao') {
                            $("#slot7").css('left', 8);
                            $("#slot7").css('top', 9);
                        } else if (arma == 'pistola') {
                            $("#slot7").css('left', -5);
                            $("#slot7").css('top', 3);
                        } else if (arma == 'machado') {
                            $("#slot7").css('left', 5);
                            $("#slot7").css('top', 11);
                        } else if (arma == 'sabre') {
                            $("#slot7").css('left', 6);
                            $("#slot7").css('top', 8);
                        } else if (arma == 'medieval') {
                            $("#slot7").css('left', 13);
                            $("#slot7").css('top', 8);
                        } else if (arma == 'taco') {
                            $("#slot7").css('left', 5);
                            $("#slot7").css('top', 4);
                        } else if (arma == 'espadavip') {
                            $("#slot7").css('left', 13);
                            $("#slot7").css('top', 8);
                        } else if (arma == 'machadovip') {
                            $("#slot7").css('left', 13);
                            $("#slot7").css('top', 4);
                        } else if (arma == 'usp-s') {
                            $("#slot7").css('left', 2);
                            $("#slot7").css('top', 8);
                        } else if (arma == 'ak47') {
                            $("#slot7").css('left', 3);
                            $("#slot7").css('top', 3);
                        } else if (arma == 'vip') {
                            $("#slot7").css('left', 3);
                            $("#slot7").css('top', 0);
                        } else if (arma == 'bazuca') {
                            $("#slot7").css('left', 3);
                            $("#slot7").css('top', 11);
                        }  else if (arma == 'coquetel') {
                            $("#slot7").css('left', 4);
                            $("#slot7").css('top', 0);
                            $("#slot7").css('width', 42);
                        } else if (arma == 'sniper') {
                            $("#slot7").css('left', 3);
                            $("#slot7").css('top', 5);
                        } else if (arma == 'mp5') {
                            $("#slot7").css('left', 3);
                            $("#slot7").css('top', 5);
                        } else if (arma == 'katana') {
                            $("#slot7").css('left', 12);
                            $("#slot7").css('top', 2);
                        } else if (arma == 'machadoverm') {
                            $("#slot7").css('left', 13);
                            $("#slot7").css('top', 4);
                        } else if (arma == 'vara') {
                            $("#slot7").css('left', 3);
                            $("#slot7").css('top', 3);
                        } else if (arma == 'stun') {
                            $("#slot7").css('left', 12);
                            $("#slot7").css('top', 16);
                        } else if (arma == 'colete') {
                            $("#slot7").css('left', 4);
                            $("#slot7").css('top', 1);
                        } else if (arma == 'kitmedico') {
                            $("#slot7").css('left', 6);
                            $("#slot7").css('top', 9);
                        } else if (arma == 'snack') {
                            $("#slot7").css('left', 6);
                            $("#slot7").css('top', 5);
                        } else if (arma == 'semente') {
                            $("#slot7").css('left', 10);
                            $("#slot7").css('top', 12);
                        } else if (arma == 'corda') {
                           $("#slot7").css('left', 2);
                            $("#slot7").css('top', 8);
                        } else if (arma == 'salmao') {
                            $("#slot7").css('left', 2);
                            $("#slot7").css('top', 3);
                        } else if (arma == 'carrot') {
                            $("#slot7").css('left', 6);
                            $("#slot7").css('top', 14);
                        } else if (arma == 'flower') {
                            $("#slot7").css('left', 14);
                            $("#slot7").css('top', 8);
                        } else if (arma == 'maconha') {
                            $("#slot7").css('left', 2);
                            $("#slot7").css('top', 6);
                        }
                        $('#slot7').css('content', 'url(/statics/img/item/' + arma + '.png)');
                        if (arma == 'kitmedico' || arma == 'snack' || arma == 'semente' || arma == 'coquetel' || arma == 'carrot' || arma == 'flower' || arma == 'maconha' || arma == 'corda' || arma == 'salmao') {
                            $('#quantity7').text(quantidade);
                            $('#quantity7').show();
                        } 
						else
						{
                            $('#wh7').css({
                                height: ((valor / clipsize) * 100) + '%'
                            }, 200);
                            $('#whp7').show();
                            $('#rr7').show();
                            $('#rr7').attr('arma', arma); 
                        }
                       }
                    }
                   if(extraData == "wslot8") {
					wslot8 = arma;
                    if (arma != 'null') {
                        if (arma == 'bastao') {
                            $("#slot8").css('left', 8);
                            $("#slot8").css('top', 9);
                        } else if (arma == 'machado') {
                            $("#slot8").css('left', 5);
                            $("#slot8").css('top', 11);
                        } else if (arma == 'sabre') {
                            $("#slot8").css('left', 6);
                            $("#slot8").css('top', 8);
                        } else if (arma == 'medieval') {
                            $("#slot8").css('left', 13);
                            $("#slot8").css('top', 8);
                        } else if (arma == 'bazuca') {
                            $("#slot8").css('left', 3);
                            $("#slot8").css('top', 11);
                        } else if (arma == 'taco') {
                            $("#slot8").css('left', 5);
                            $("#slot8").css('top', 4);
                        } else if (arma == 'espadavip') {
                            $("#slot8").css('left', 13);
                            $("#slot8").css('top', 8);
                        } else if (arma == 'machadovip') {
                            $("#slot8").css('left', 13);
                            $("#slot8").css('top', 4);
                        } else if (arma == 'usp-s') {
                            $("#slot8").css('left', 2);
                            $("#slot8").css('top', 8);
                        } else if (arma == 'ak47') {
                            $("#slot8").css('left', 3);
                            $("#slot8").css('top', 3);
                        } else if (arma == 'vip') {
                            $("#slot8").css('left', 3);
                            $("#slot8").css('top', 0);
                        } else if (arma == 'sniper') {
                            $("#slot8").css('left', 3);
                            $("#slot8").css('top', 5);
                        } else if (arma == 'mp5') {
                            $("#slot8").css('left', 3);
                            $("#slot8").css('top', 5);
                        } else if (arma == 'katana') {
                            $("#slot8").css('left', 12);
                            $("#slot8").css('top', 2);
                        } else if (arma == 'machadoverm') {
                            $("#slot8").css('left', 13);
                            $("#slot8").css('top', 4);
                        } else if (arma == 'vara') {
                            $("#slot8").css('left', 3);
                            $("#slot8").css('top', 3);
                        } else if (arma == 'stun') {
                            $("#slot8").css('left', 12);
                            $("#slot8").css('top', 16);
                        } else if (arma == 'pistola') {
                            $("#slot8").css('left', -5);
                            $("#slot8").css('top', 3);
                        } else if (arma == 'colete') {
                            $("#slot8").css('left', 4);
                            $("#slot8").css('top', 1);
                        } else if (arma == 'kitmedico') {
                            $("#slot8").css('left', 6);
                            $("#slot8").css('top', 9);
                        } else if (arma == 'snack') {
                            $("#slot8").css('left', 6);
                            $("#slot8").css('top', 5);
                        } else if (arma == 'semente') {
                            $("#slot8").css('left', 10);
                            $("#slot8").css('top', 12);
                        } else if (arma == 'corda') {
                            $("#slot8").css('left', 2);
                            $("#slot8").css('top', 8);
                        } else if (arma == 'salmao') {
                            $("#slot8").css('left', 2);
                            $("#slot8").css('top', 3);
                        } else if (arma == 'carrot') {
                            $("#slot8").css('left', 6);
                            $("#slot8").css('top', 14);
                        } else if (arma == 'flower') {
                            $("#slot8").css('left', 14);
                            $("#slot8").css('top', 8);
                        } else if (arma == 'maconha') {
                            $("#slot8").css('left', 2);
                            $("#slot8").css('top', 6);
                        }	
                        $('#slot8').css('content', 'url(/statics/img/item/' + arma + '.png)');
                        if (arma == 'kitmedico' || arma == 'snack' || arma == 'semente' || arma == 'carrot' || arma == 'flower' || arma == 'maconha' || arma == 'corda' || arma == 'salmao') {
                            $('#quantity8').text(quantidade);
                            $('#quantity8').show();
                        } 
						else
						{
                            $('#wh8').css({
                                height: ((valor / clipsize) * 100) + '%'
                            }, 200);
                            $('#whp8').show();
                            $('#rr8').show();
                            $('#rr8').attr('arma', arma); 
                        }
                     }
                   }
                   if(extraData == "wslot9") {
					wslot9 = arma;
                    if (arma != 'null') {
                        if (arma == 'bastao') {
                            $("#slot9").css('left', 8);
                            $("#slot9").css('top', 9);
                        } else if (arma == 'machado') {
                            $("#slot9").css('left', 5);
                            $("#slot9").css('top', 11);
                        } else if (arma == 'medieval') {
                            $("#slot9").css('left', 13);
                            $("#slot9").css('top', 8);
                        } else if (arma == 'sabre') {
                            $("#slot9").css('left', 6);
                            $("#slot9").css('top', 8);
                        } else if (arma == 'bazuca') {
                            $("#slot9").css('left', 3);
                            $("#slot9").css('top', 11);
                        } else if (arma == 'coquetel') {
                            $("#slot9").css('left', 4);
                            $("#slot9").css('top', 0);
                            $("#slot9").css('width', 42);
                        } else if (arma == 'taco') {
                            $("#slot9").css('left', 5);
                            $("#slot9").css('top', 4);
                        } else if (arma == 'espadavip') {
                            $("#slot9").css('left', 13);
                            $("#slot9").css('top', 8);
                        } else if (arma == 'machadovip') {
                            $("#slot9").css('left', 13);
                            $("#slot9").css('top', 4);
                        } else if (arma == 'usp-s') {
                            $("#slot9").css('left', 2);
                            $("#slot9").css('top', 8);
                        } else if (arma == 'ak47') {
                            $("#slot9").css('left', 3);
                            $("#slot9").css('top', 3);
                        } else if (arma == 'vip') {
                            $("#slot9").css('left', 3);
                            $("#slot9").css('top', 0);
                        } else if (arma == 'pistola') {
                            $("#slot9").css('left', -5);
                            $("#slot9").css('top', 3);
                        } else if (arma == 'sniper') {
                            $("#slot9").css('left', 3);
                            $("#slot9").css('top', 5);
                        } else if (arma == 'mp5') {
                            $("#slot9").css('left', 3);
                            $("#slot9").css('top', 5);
                        } else if (arma == 'katana') {
                            $("#slot9").css('left', 12);
                            $("#slot9").css('top', 2);
                        } else if (arma == 'machadoverm') {
                            $("#slot9").css('left', 13);
                            $("#slot9").css('top', 4);
                        } else if (arma == 'vara') {
                            $("#slot9").css('left', 3);
                            $("#slot9").css('top', 3);
                        } else if (arma == 'stun') {
                            $("#slot9").css('left', 12);
                            $("#slot9").css('top', 16);
                        } else if (arma == 'colete') {
                            $("#slot9").css('left', 4);
                            $("#slot9").css('top', 1);
                        } else if (arma == 'kitmedico') {
                            $("#slot9").css('left', 6);
                            $("#slot9").css('top', 9);
                        } else if (arma == 'snack') {
                            $("#slot9").css('left', 6);
                            $("#slot9").css('top', 5);
                        } else if (arma == 'semente') {
                            $("#slot9").css('left', 10);
                            $("#slot9").css('top', 12);
                        } else if (arma == 'corda') {
                            $("#slot9").css('left', 2);
                            $("#slot9").css('top', 8);
                        } else if (arma == 'salmao') {
                            $("#slot9").css('left', 2);
                            $("#slot9").css('top', 3);
                        } else if (arma == 'carrot') {
                            $("#slot9").css('left', 6);
                            $("#slot9").css('top', 14);
                        } else if (arma == 'flower') {
                            $("#slot9").css('left', 14);
                            $("#slot9").css('top', 8);
                        } else if (arma == 'maconha') {
                            $("#slot9").css('left', 2);
                            $("#slot9").css('top', 6);
                        }
                        $('#slot9').css('content', 'url(/statics/img/item/' + arma + '.png)');
                        if (arma == 'kitmedico' || arma == 'snack' || arma == 'semente' || arma == 'coquetel' || arma == 'carrot' || arma == 'flower' || arma == 'maconha' || arma == 'corda' || arma == 'salmao') {
                            $('#quantity9').text(quantidade);
                            $('#quantity9').show();
                        } 
						else
						{
                            $('#wh9').css({
                                height: ((valor / clipsize) * 100) + '%'
                            }, 200);
                            $('#whp9').show();
                            $('#rr9').show();
                            $('#rr9').attr('arma', arma); 
						}
                      }
                   }
                   if(extraData == "wslot10") {
					wslot10 = arma;
                    if (arma != 'null') {
                        if (arma == 'bastao') {
                            $("#slot10").css('left', 8);
                            $("#slot10").css('top', 9);
                        } else if (arma == 'machado') {
                            $("#slot10").css('left', 5);
                            $("#slot10").css('top', 11);
                        } else if (arma == 'medieval') {
                            $("#slot10").css('left', 13);
                            $("#slot10").css('top', 8);
                        } else if (arma == 'sabre') {
                            $("#slot10").css('left', 6);
                            $("#slot10").css('top', 8);
                        } else if (arma == 'bazuca') {
                            $("#slot10").css('left', 3);
                           $("#slot10").css('top', 11);
                        } else if (arma == 'taco') {
                            $("#slot10").css('left', 5);
                            $("#slot10").css('top', 4);
                        } else if (arma == 'espadavip') {
                            $("#slot10").css('left', 13);
                            $("#slot10").css('top', 8);
                        } else if (arma == 'machadovip') {
                            $("#slot10").css('left', 13);
                            $("#slot10").css('top', 4);
                        } else if (arma == 'usp-s') {
                            $("#slot10").css('left', 2);
                            $("#slot10").css('top', 8);
                        } else if (arma == 'pistola') {
                            $("#slot10").css('left', -5);
                            $("#slot10").css('top', 3);
                        } else if (arma == 'ak47') {
                            $("#slot10").css('left', 3);
                            $("#slot10").css('top', 3);
                        } else if (arma == 'vip') {
                            $("#slot10").css('left', 3);
                            $("#slot10").css('top', 0);
                        } else if (arma == 'sniper') {
                            $("#slot10").css('left', 3);
                            $("#slot10").css('top', 5);
                        } else if (arma == 'mp5') {
                            $("#slot10").css('left', 3);
                            $("#slot10").css('top', 5);
                        } else if (arma == 'katana') {
                            $("#slot10").css('left', 12);
                            $("#slot10").css('top', 2);
                        } else if (arma == 'machadoverm') {
                            $("#slot10").css('left', 13);
                            $("#slot10").css('top', 4);
                        } else if (arma == 'vara') {
                            $("#slot10").css('left', 3);
                            $("#slot10").css('top', 3);
                        } else if (arma == 'stun') {
                            $("#slot10").css('left', 12);
                            $("#slot10").css('top', 16);
                        } else if (arma == 'colete') {
                            $("#slot10").css('left', 4);
                            $("#slot10").css('top', 1);
                        } else if (arma == 'kitmedico') {
                            $("#slot10").css('left', 6);
                            $("#slot10").css('top', 9);
                        } else if (arma == 'snack') {
                            $("#slot10").css('left', 6);
                            $("#slot10").css('top', 5);
                        } else if (arma == 'semente') {
                            $("#slot10").css('left', 10);
                            $("#slot10").css('top', 12);
                        } else if (arma == 'corda') {
                            $("#slot10").css('left', 2);
                            $("#slot10").css('top', 8);
                        } else if (arma == 'salmao') {
                            $("#slot10").css('left', 2);
                            $("#slot10").css('top', 3);
                        } else if (arma == 'carrot') {
                            $("#slot10").css('left', 6);
                            $("#slot10").css('top', 14);
                        } else if (arma == 'flower') {
                            $("#slot10").css('left', 14);
                            $("#slot10").css('top', 8);
                        } else if (arma == 'maconha') {
                            $("#slot10").css('left', 2);
                            $("#slot10").css('top', 6);
                        }	
                        $('#slot10').css('content', 'url(/statics/img/item/' + arma + '.png)');
                        if (arma == 'kitmedico' || arma == 'snack' || arma == 'semente' || arma == 'carrot' || arma == 'flower' || arma == 'maconha' || arma == 'corda' || arma == 'salmao') {
                            $('#quantity10').text(quantidade);
                            $('#quantity10').show();
                        } 
						else
						{
                            $('#wh10').css({
                               height: ((valor / clipsize) * 100) + '%'
                            }, 200);
                            $('#whp10').show();
                            $('#rr10').show();
                            $('#rr10').attr('arma', arma); 
						}
                     }
                   }
                   if(extraData == "wslot11") {
					wslot11 = arma;
                    if (arma != 'null') {
                        if (arma == 'bastao') {
                            $("#slot11").css('left', 8);
                            $("#slot11").css('top', 9);
                        } else if (arma == 'machado') {
                            $("#slot11").css('left', 5);
                            $("#slot11").css('top', 11);
                        } else if (arma == 'medieval') {
                            $("#slot11").css('left', 13);
                            $("#slot11").css('top', 8);
                        } else if (arma == 'taco') {
                            $("#slot11").css('left', 5);
                            $("#slot11").css('top', 4);
                        } else if (arma == 'espadavip') {
                            $("#slot11").css('left', 13);
                            $("#slot11").css('top', 8);
                        } else if (arma == 'sabre') {
                            $("#slot11").css('left', 6);
                            $("#slot11").css('top', 8);
                        } else if (arma == 'machadovip') {
                            $("#slot11").css('left', 13);
                            $("#slot11").css('top', 4);
                        } else if (arma == 'usp-s') {
                            $("#slot11").css('left', 2);
                            $("#slot11").css('top', 8);
                        } else if (arma == 'ak47') {
                            $("#slot11").css('left', 3);
                            $("#slot11").css('top', 3);
                        } else if (arma == 'vip') {
                            $("#slot11").css('left', 3);
                            $("#slot11").css('top', 0);
                        } else if (arma == 'sniper') {
                            $("#slot11").css('left', 3);
                            $("#slot11").css('top', 5);
                        } else if (arma == 'mp5') {
                            $("#slot11").css('left', 3);
                            $("#slot11").css('top', 5);
                        } else if (arma == 'katana') {
                            $("#slot11").css('left', 12);
                            $("#slot11").css('top', 2);
                        } else if (arma == 'machadoverm') {
                            $("#slot11").css('left', 13);
                            $("#slot11").css('top', 4);
                        } else if (arma == 'bazuca') {
                            $("#slot11").css('left', 3);
                            $("#slot11").css('top', 11);
                        } else if (arma == 'vara') {
                            $("#slot11").css('left', 3);
                            $("#slot11").css('top', 3);
                        } else if (arma == 'stun') {
                            $("#slot11").css('left', 12);
                            $("#slot11").css('top', 16);
                        } else if (arma == 'colete') {
                            $("#slot11").css('left', 4);
                            $("#slot11").css('top', 1);
                        } else if (arma == 'kitmedico') {
                            $("#slot11").css('left', 6);
                            $("#slot11").css('top', 9);
                        } else if (arma == 'snack') {
                            $("#slot11").css('left', 6);
                            $("#slot11").css('top', 5);
                        } else if (arma == 'semente') {
                            $("#slot11").css('left', 10);
                            $("#slot11").css('top', 12);
                        } else if (arma == 'corda') {
                            $("#slot11").css('left', 2);
                            $("#slot11").css('top', 8);
                        } else if (arma == 'salmao') {
                            $("#slot11").css('left', 2);
                            $("#slot11").css('top', 3);
                        } else if (arma == 'carrot') {
                            $("#slot11").css('left', 6);
                            $("#slot11").css('top', 14);
                        } else if (arma == 'flower') {
                            $("#slot11").css('left', 14);
                            $("#slot11").css('top', 8);
                        } else if (arma == 'maconha') {
                            $("#slot11").css('left', 2);
                            $("#slot11").css('top', 6);
                        }
                       $('#slot11').css('content', 'url(/statics/img/item/' + arma + '.png)');
                        if (arma == 'kitmedico' || arma == 'snack' || arma == 'semente' || arma == 'carrot' || arma == 'flower' || arma == 'maconha' || arma == 'corda' || arma == 'salmao') {
                            $('#quantity11').text(quantidade);
                            $('#quantity11').show();
                        }
						else
						{
                            $('#wh11').css({
                                height: ((valor / clipsize) * 100) + '%'
                            }, 200);
                            $('#whp11').show();
                            $('#rr11').show();
                            $('#rr11').attr('arma', arma); 
						}
                     }
                   }
                  if(extraData == "wslot12") {
					wslot12 = arma;
                    if (arma != 'null') {
                        if (arma == 'bastao') {
                            $("#slot12").css('left', 8);
                            $("#slot12").css('top', 9);
                        } else if (arma == 'machado') {
                            $("#slot12").css('left', 5);
                            $("#slot12").css('top', 11);
                        } else if (arma == 'medieval') {
                            $("#slot12").css('left', 13);
                            $("#slot12").css('top', 8);
                        } else if (arma == 'sabre') {
                            $("#slot12").css('left', 6);
                            $("#slot12").css('top', 8);
                        } else if (arma == 'bazuca') {
                            $("#slot12").css('left', 3);
                            $("#slot12").css('top', 11);
                        } else if (arma == 'taco') {
                            $("#slot12").css('left', 5);
                            $("#slot12").css('top', 4);
                        } else if (arma == 'espadavip') {
                            $("#slot12").css('left', 13);
                            $("#slot12").css('top', 8);
                        } else if (arma == 'machadovip') {
                            $("#slot12").css('left', 13);
                            $("#slot12").css('top', 4);
                        } else if (arma == 'usp-s') {
                            $("#slot12").css('left', 2);
                            $("#slot12").css('top', 8);
                        } else if (arma == 'ak47') {
                            $("#slot12").css('left', 3);
                            $("#slot12").css('top', 3);
                        } else if (arma == 'vip') {
                            $("#slot12").css('left', 3);
                            $("#slot12").css('top', 0);
                        } else if (arma == 'sniper') {
                            $("#slot12").css('left', 3);
                            $("#slot12").css('top', 5);
                        } else if (arma == 'mp5') {
                            $("#slot12").css('left', 3);
                            $("#slot12").css('top', 5);
                        } else if (arma == 'katana') {
                            $("#slot12").css('left', 12);
                            $("#slot12").css('top', 2);
                        } else if (arma == 'machadoverm') {
                            $("#slot12").css('left', 13);
                            $("#slot12").css('top', 4);
                        } else if (arma == 'vara') {
                            $("#slot12").css('left', 3);
                            $("#slot12").css('top', 3);
                        } else if (arma == 'stun') {
                            $("#slot12").css('left', 12);
                            $("#slot12").css('top', 16);
                        } else if (arma == 'colete') {
                            $("#slot12").css('left', 4);
                            $("#slot12").css('top', 1);
                        } else if (arma == 'kitmedico') {
                            $("#slot12").css('left', 6);
                            $("#slot12").css('top', 9);
                        } else if (arma == 'snack') {
                            $("#slot12").css('left', 6);
                            $("#slot12").css('top', 5);
                        } else if (arma == 'semente') {
                            $("#slot12").css('left', 10);
                            $("#slot12").css('top', 12);
                        } else if (arma == 'corda') {
                            $("#slot12").css('left', 2);
                            $("#slot12").css('top', 8);
                        } else if (arma == 'salmao') {
                            $("#slot12").css('left', 2);
                            $("#slot12").css('top', 3);
                        } else if (arma == 'carrot') {
                            $("#slot12").css('left', 6);
                            $("#slot12").css('top', 14);
                        } else if (arma == 'flower') {
                            $("#slot12").css('left', 14);
                            $("#slot12").css('top', 8);
                        } else if (arma == 'maconha') {
                            $("#slot12").css('left', 2);
                            $("#slot12").css('top', 6);
                        }
                        $('#slot12').css('content', 'url(/statics/img/item/' + arma + '.png)');
                        if (arma == 'kitmedico' || arma == 'snack' || arma == 'semente' || arma == 'carrot' || arma == 'flower' || arma == 'maconha' || arma == 'corda' || arma == 'salmao') {
                            $('#quantity12').text(quantidade);
                            $('#quantity12').show();
                        } 
						else
						{
                            $('#wh12').css({
                                height: ((valor / clipsize) * 100) + '%'
                            }, 200);
                            $('#whp12').show();
                            $('#rr12').show();
                            $('#rr12').attr('arma', arma); 
						}
                     }
                   }    
                    break;

				}


			    case 'smoke': {

					if(extraData == "start")

					{

						$("body").addClass("smoke_effect");

					}

					else if(extraData == "stop")

					{

						$("body").removeClass("smoke_effect");

					}

					break;

				}

				case 'bio': {

					var type = eventData[1];

					var bio = eventData[2];

					if(type == "alterar")

					{                

			    	$('#frase-bio').show();

                    $('#ed-bio').show();

                    $('#digitar-bio').hide();
                    bioeditar = false;
                    $("#sv-bio").hide();

                    $("#cl-bio").hide();

                

                    $("#frase-bio").text(bio);

					}

					

					if(type == "hide")

					{

						user.AudioTaser.pause();

						user.AudioTaser.currentTime = 0;

					}
					break;

				}

				case 'armas': {

					var type = eventData[1];
					var arma = eventData[2];
					if(type == "play")

					{ 
					  var armas = new Audio('swf/audio/'+ arma + '.mp3');
						armas.play();
					}
					if(type == "falhou")

					{
					    var armas = new Audio('swf/audio/'+ arma + '.mp3');
						armas.play();

					}
					break;

				}
				case 'police': {

					var type = eventData[1];

					if(type == "taser")

					{

						user.AudioTaser.play();

					}

					

					if(type == "detaser")

					{

						user.AudioTaser.pause();

						user.AudioTaser.currentTime = 0;

					}

					break;
				}

				case 'kill': {

					var idMessage = extraData;

					var nome1 = eventData[2];

					var nome2 = eventData[3];

						$("#livefeed-new").append('<div id="corpo-livefeed-new" class="div-' + idMessage + '"><div id="fonte-livefeed"><span id="texto-vermelho">' + nome1 + '</span> matou <span id="texto-azul">' + nome2 + '</span></div></div>');

                        $('.div-' + idMessage + '').hide(15000);

					setTimeout(function(){$('.div-' + idMessage).remove(); }, 30000);

					break;

				}

                   

				case 'last_action': {

					var idMessage = extraData;

					var msg = eventData[2];

					var imagem = eventData[3];

					

						if (imagem == 1)

							img = "/statics/img/procu.png";

						if (imagem == 2)

							img = "/statics/img/info.png";

						if (imagem == 3)

							img = "/statics/img/vp.png";

						if (imagem == 4)

						{

							img = "/statics/img/cowboy_icon.gif";

						}

						if (imagem == 5)

							img = "/statics/img/emp.png";

							

						if (imagem == 6)

						{

							img = "";

						}


					if (livefeed == true)

					{

						 var tempo = 4;

						var segundos = tempo * 1000;

						

					$('.feed-container').append('<div class="base dark default-vars with-img" id="action_' + idMessage + '" style="width: auto; cursor: pointer; animation: 0.4s ease 0s 1 normal forwards running animation-show;"><img class="img" id="img-feed-tipo-4" src="'+ img +'" style="display: block;"><div class="text">' + msg + '</div></div>');

                  

					setTimeout(function(){$('#action_' + idMessage).addClass("feed-hide"); }, 4000);

                    setTimeout(function(){$('#action_' + idMessage).remove(); }, 5000);

					}

					break;

					

				}

				case 'hide': {
				  var quantity = eventData[2];
                   if(extraData == "w1") {
                        wslot1 = null;
                        if (quantity == '0') {
                            $('#slot1').css('content', 'url()');
                            $('#whp1').hide();
                            $('#rr1').hide();
                            $('#quantity1').hide();
                        } else
                            $('#quantity1').text(quantity);
                    } else if(extraData == "w2") {
                        wslot2 = null;
                        if (quantity == '0') {
                            $('#slot2').css('content', 'url()');
                            $('#whp2').hide();
                            $('#rr2').hide();
                            $('#quantity2').hide();
                        } else
                            $('#quantity2').text(quantity);
                    } else if(extraData == "w3") {
                        wslot3 = null;
                        if (quantity == '0') {
                            $('#slot3').css('content', 'url()');
                            $('#whp3').hide();
                            $('#rr3').hide();
                            $('#quantity3').hide();
                        } else
                            $('#quantity3').text(quantity);
                    } else if(extraData == "w4") {
                        wslot4 = null;
                        if (quantity == '0') {
                            $('#slot4').css('content', 'url()');
                            $('#rr4').hide();
                            $('#whp4').hide();
                            $('#quantity4').hide();
                        } else
                            $('#quantity4').text(quantity);
                    } else if(extraData == "w5") {
                        wslot5 = null;
                        if (quantity == '0') {
                            $('#slot5').css('content', 'url()');
                            $('#whp5').hide();
                            $('#rr5').hide();
                            $('#quantity5').hide();
                        } else
                            $('#quantity5').text(quantity);
                    } else if(extraData == "w6") {
                        wslot6 = null;
                        if (quantity == '0') {
                            $('#slot6').css('content', 'url()');
                            $('#whp6').hide();
                            $('#rr6').hide();
                            $('#quantity6').hide();
                        } else
                            $('#quantity6').text(quantity);
                    } else if(extraData == "w7") {
                        wslot7 = null;
                        if (quantity == '0') {
                            $('#slot7').css('content', 'url()');
                            $('#whp7').hide();
                            $('#rr7').hide();
                            $('#quantity7').hide();
                        } else
                            $('#quantity7').text(quantity);
                    } else if(extraData == "w8") {
                        wslot8 = null;
                        if (quantity == '0') {
                            $('#slot8').css('content', 'url()');
                            $('#whp8').hide();
                            $('#rr8').hide();
                            $('#quantity8').hide();
                        } else
                            $('#quantity8').text(quantity);
                    } else if(extraData == "w9") {
                        wslot9 = null;
                        if (quantity == '0') {
                            $('#slot9').css('content', 'url()');
                            $('#whp9').hide();
                            $('#rr9').hide();
                            $('#quantity9').hide();
                        } else
                            $('#quantity9').text(quantity);
                    } else if(extraData == "w10") {
                        wslot10 = null;
                        if (quantity == '0') {
                            $('#slot10').css('content', 'url()');
                            $('#rr10').hide();
                            $('#whp10').hide();
                            $('#quantity10').hide();
                        } else
                            $('#quantity10').text(quantity);
                    } else if(extraData == "w11") {
                        wslot11 = null;
                        if (quantity == '0') {
                            $('#slot11').css('content', 'url()');
                            $('#rr11').hide();
                            $('#whp11').hide();
                            $('#quantity11').hide();

                        } else
                            $('#quantity11').text(quantity);
                    } else if(extraData == "eq1") {
						sloteq1 = null;
                            $('#eslot1').css('content', 'url()');
                            $('#ehp1').hide();
			             	$('#qtt-balas').hide();
                    } else if(extraData == "eq2") {
						sloteq2 = null;
                        if (quantity == '0') {
                            $('#eslot2').css('content', 'url()');
                            $('#ehp2').hide();
                        } else
                            $('#quantity11').text(quantity);
                    } else if(extraData == "w12") {
                        wslot12 = null;
                        if (quantity == '0') {
                            $('#slot12').css('content', 'url()');
                            $('#rr12').hide();
                            $('#whp12').hide();
                            $('#quantity12').hide();
                        } else
                            $('#quantity12').text(quantity);
                    }
				    break;
				}
				case 'oferta': {					
					var ofertante = eventData[1];
					var oferta = eventData[2];
				    var valor = eventData[3];
				    var tipo = eventData[4];
				        $('#hl-name').text(ofertante);
				        $('#hl-item').text(oferta);
				        $('#hl-stake').text(valor);
                        $('#hl-offer').show();
						break;
				}

				case 'macro': {
				    var key = eventData[1];
				    var data = eventData[2];
				    var teclam = eventData[3];
				        fpress = teclam;
				    	$("#settings .body .settings-category-options .macros").append('<div class="macro"><div class="macro-combo">' + key + '</div><div class="macro-value">' + data + '</div><div class="macro-delete"><div class="macro-delete-button" id="'+ teclam +'">Remover</div></div></div>');  
				    	addmacros = true;
			             $('#macro-press-key').text("Clique e pressione a Tecla");
				    break;
				}
				case 'mapa': {
					var ms1 = eventData[1];
					var ms2 = eventData[2];					
			        var px1 = Math.ceil(((ms1*4)));	
		            var px2 = Math.ceil(((ms2*4)));
					$('.map-2mcxq_0').css({'background-position': + px1 +'px '+ px2 +'px'}).show();
					break;
				}

				case 'quarto': {
					var idMessage = extraData;					
						$("#nome-room").text(idMessage);					
						$('#icon-apt').hide();
						break;
				}
				case 'julgamento': {
					var type = eventData[1];
					if(type == "show")
					{
					$('#called-for-jury').css({'display':'block','z-index':'1'}).show();
					}
					else if(type == "stop")
					{
					$('#called-for-jury').css({'display':'none','z-index':'0'}).hide();
					}
					break;
				}

				case 'votar': {
					var type = eventData[1];
					if(type == "show")
					{
					$('#jury-voting').css({'display':'block','z-index':'1'}).show();
					}
					else if(type == "stop")
					{
					$('#jury-voting').css({'display':'none','z-index':'0'}).hide();
					}
					break;

				}

			    case 'gmodo': {

					var type = eventData[1];

					if(type == "quarto")

					{

						$("#chatmode").text("Q");

					}

					else if(type == "gangue")

					{

						$("#chatmode").text("G");

					}

					break;

				}
				case 'lojas': {

					var type = eventData[1];
					var item = eventData[2];
					var valor = eventData[3];
					var nome = eventData[4];
					var dano = eventData[5];
					var dano2 = eventData[6];
					if(type == "abrir")
					{

					 if (arma == 'kitmedico' || arma == 'snack' || arma == 'semente' || arma == 'carrot' || arma == 'flower' || arma == 'maconha' || arma == 'corda' || arma == 'salmao')
					    {

                        } 
						else
						{

					  $('.items-loja').append(''
					    + '<dts class="lojaite" id="' + item + '"> '
					    + '<div class="imagesitems">'
					    + '<div class="images-armas">'
					    + '<div class="images-armas"><img class="imgs" src="/statics/img/item/' + item + '.png"></div>'
					    + '<div class="items-description">'
					    + '<div class="nome-dos-items">' + nome + '</div>'
					    + '<div class="descricao-items">'
					    + '<div class="dano-dos-items">DANO: ' + dano + ' - ' + dano2 + '</div>'
					    + '<div class="custo-dos-items">CUSTO: R$' + valor + '</div><br></div></div>'
					    + '</div>'
					    + '<img class="itemsbuy" style="pointer:cursor;" arma="' + item + '" src="https://i.imgur.com/1H8ZEDt.png">'
					    + '</div>'
					    + '</dts>'
					    
                      +  '');					


					   $('.loja-ver').show();
                        
						}
					}
                    else if(type == "fechar")
					{
					   $('.loja-ver').hide();

					}
					else if(type == "outros")
					{
					
					$("#" + item).remove();
					}
				     	else if(type == "limpar")
				    	{
					     $(".items-loja").empty();
				    	}
                   }
					break;
			    case 'verificar': {

					var type = eventData[1];
					var nickusuarios = eventData[2];
					var keygg = eventData[3];
					if(type == "abrir")
					{
					    
					    $('.carregamento-identidade').show();
					    $('.identidade-hyce-ver').show();
                        $('#nickusuarios').attr('placeholder', nickusuarios); 
						$('.keygg').text(keygg);
                    }
                    else if(type == "fechar")
					{
					    $('.carregamento-identidade').hide();
					    $('.identidade-hyce-ver').hide();

					}
					break;

				}

				case 'telephone': {

					var type = eventData[1];

					if(type == "show")

					{

						user.canUsePhone = true;

						$('#phone').show();

					}

					else if(type == "hide")

					{

						user.canUsePhone = false;

						$('#phone').hide();

					}

					else if(type == "youtube")

					{

						$('#phone #menu').hide();

						$('#phone #youtube .search_result').hide();

						$('#phone #youtube .video').hide();

						$("#phone #youtube #searchYtInput").val("");

						$('#phone #youtube').fadeIn("slow");

					}

					else if(type == "banque")

					{

						var solde = eventData[2];

						$('#phone #banque #banque_solde').html(solde);

						$('#phone #menu').hide();

						$('#phone #banque').fadeIn("slow");

					}

					else if(type == "bouygues")

					{

						var appel = eventData[2];

						var sms = eventData[3];

						var typeForfait = eventData[4];

						$('#phone #bouygues #forfaitName').html(typeForfait);

						$('#phone #bouygues #smsCount').html(sms);

						$('#phone #bouygues #appelCount').html(appel);

						$('#phone #menu').hide();

						$('#phone #bouygues').fadeIn("slow");

					}
					else if(type == "send_appel")

					{

				        var roupa = "https://avatar.habblive.net/habbo-imaging/avatarimage?figure=";

						var username = eventData[2];

						var figure = eventData[3];

						user.appel = true;

						$("#appel .avatar img").attr("src", roupa + figure);

						$('#appel h1').html("Ligando para " + username + "...");

						$('#phone #appel_user').hide();
                        caixaligar = false;
		
						$('#phone #contacts').hide();

						$('#phone #sms_user').hide();

						$('#phone #facebook').hide();

						$('#phone #appel #raccrocher').hide();

						$('#phone #appel #repondre').hide();

						$('#phone #appel').fadeIn("slow");

						

					}

					else if(type == "receive_appel")

					{

				        var roupa = "https://avatar.habblive.net/habbo-imaging/avatarimage?figure=";

						var username = eventData[2];

						var figure = eventData[3];

						user.appel = true;

						user.AudioSonnerie.play();

						$("#appel .avatar img").attr("src", roupa + figure);

						$('#appel h1').html(username + " está te ligando...");

						$('#phone #contacts').hide();

						$('#phone #calculatrice').hide();

						$('#phone #banque').hide();

						$('#phone #bouygues').hide();

						$('#phone #menu').hide();

						$('#phone #sms').hide();

						$('#phone #sms_user').hide();
						caixasms = false;
						$('#phone #facebook').hide();

						$('#phone #flappy').hide();

						$('#phone #appel_user').hide();
                        caixaligar = false;
		
						$('#phone #youtube #yt_iframe').attr('src', 'https://www.youtube.com/embed/?autoplay=1');

						$('#phone #youtube').hide();

						$('#phone #appel #raccrocher').show();

						$('#phone #appel #repondre').show();

						$('#phone #appel').fadeIn("slow");

						

					}

					else if(type == "isAppel")

					{

						user.appel = true;

						$('#appel h1').html("00:00");

						$('#phone #appel #raccrocher').show();

						$('#phone #appel #repondre').hide();

					}

					else if(type == "closeAppel")

					{

						user.AudioSonnerie.pause();

						user.AudioSonnerie.currentTime = 0;

						user.appel = false;

						$('#appel h1').html("");

						$('#phone #appel').hide();

						$('#phone #menu').fadeIn("slow");

					}

					else if(type == "timeAppel")

					{

						var timeAppel = eventData[2];

						$('#appel h1').html(timeAppel);

					}

					else if(type == "setReseau")

					{

						var barre = eventData[2];

						if(barre == 0)

						{

							user.Reseau = 0;

							$("#phone .header #tel_wifi").hide();

							$("#phone .header #reseau1").removeClass();

							$("#phone .header #reseau2").removeClass();

							$("#phone .header #reseau3").removeClass();

							$("#phone .header #reseau4").removeClass();

							$("#phone .header #reseau5").removeClass();

							$("#phone .header #reseau1").addClass("far fa-circle");

							$("#phone .header #reseau2").addClass("far fa-circle");

							$("#phone .header #reseau3").addClass("far fa-circle");

							$("#phone .header #reseau4").addClass("far fa-circle");

							$("#phone .header #reseau5").addClass("far fa-circle");

						}

						else if(barre == 1)

						{

							user.Reseau = 1;

							$("#phone .header #tel_wifi").hide();

							$("#phone .header #reseau1").removeClass();

							$("#phone .header #reseau2").removeClass();

							$("#phone .header #reseau3").removeClass();

							$("#phone .header #reseau4").removeClass();

							$("#phone .header #reseau5").removeClass();

							$("#phone .header #reseau1").addClass("fas fa-circle");

							$("#phone .header #reseau2").addClass("far fa-circle");

							$("#phone .header #reseau3").addClass("far fa-circle");

							$("#phone .header #reseau4").addClass("far fa-circle");

							$("#phone .header #reseau5").addClass("far fa-circle");

						}

						else if(barre == 2)

						{

							user.Reseau = 2;

							$("#phone .header #tel_wifi").show();

							$("#phone .header #reseau1").removeClass();

							$("#phone .header #reseau2").removeClass();

							$("#phone .header #reseau3").removeClass();

							$("#phone .header #reseau4").removeClass();

							$("#phone .header #reseau5").removeClass();

							$("#phone .header #reseau1").addClass("fas fa-circle");

							$("#phone .header #reseau2").addClass("fas fa-circle");

							$("#phone .header #reseau3").addClass("far fa-circle");

							$("#phone .header #reseau4").addClass("far fa-circle");

							$("#phone .header #reseau5").addClass("far fa-circle");

						}

						else if(barre == 3)

						{

							user.Reseau = 3;

							$("#phone .header #tel_wifi").show();

							$("#phone .header #reseau1").removeClass();

							$("#phone .header #reseau2").removeClass();

							$("#phone .header #reseau3").removeClass();

							$("#phone .header #reseau4").removeClass();

							$("#phone .header #reseau5").removeClass();

							$("#phone .header #reseau1").addClass("fas fa-circle");

							$("#phone .header #reseau2").addClass("fas fa-circle");

							$("#phone .header #reseau3").addClass("fas fa-circle");

							$("#phone .header #reseau4").addClass("far fa-circle");

							$("#phone .header #reseau5").addClass("far fa-circle");

						}

						else if(barre == 4)

						{

							user.Reseau = 4;

							$("#phone .header #tel_wifi").show();

							$("#phone .header #reseau1").removeClass();

							$("#phone .header #reseau2").removeClass();

							$("#phone .header #reseau3").removeClass();

							$("#phone .header #reseau4").removeClass();

							$("#phone .header #reseau5").removeClass();

							$("#phone .header #reseau1").addClass("fas fa-circle");

							$("#phone .header #reseau2").addClass("fas fa-circle");

							$("#phone .header #reseau3").addClass("fas fa-circle");

							$("#phone .header #reseau4").addClass("fas fa-circle");

							$("#phone .header #reseau5").addClass("far fa-circle");

						}

						else if(barre == 5)

						{

							user.Reseau = 5;

							$("#phone .header #tel_wifi").show();

							$("#phone .header #reseau1").removeClass();

							$("#phone .header #reseau2").removeClass();

							$("#phone .header #reseau3").removeClass();

							$("#phone .header #reseau4").removeClass();

							$("#phone .header #reseau5").removeClass();

							$("#phone .header #reseau1").addClass("fas fa-circle");

							$("#phone .header #reseau2").addClass("fas fa-circle");

							$("#phone .header #reseau3").addClass("fas fa-circle");

							$("#phone .header #reseau4").addClass("fas fa-circle");

							$("#phone .header #reseau5").addClass("fas fa-circle");

						}

					}

					break;

				}

				

				case 'glista':

				{

					var userid = eventData[1];

					var ucargo = eventData[2];

					var nome = eventData[3];

					var look = eventData[4];

					var online = eventData[5];

					var lider = eventData[6];

					

				if (lider == user.id)

				{

					$('.botao-editar').show();

					var r2 = '<div class="gang-member-actions"><div class="remove-member" remover="' + userid + '"></div><div class="demote-member" rebaixar="' + userid + '"></div></div>';

					var r5 = '<div class="gang-member-actions"><div class="remove-member" remover="' + userid + '"></div><div class="promote-member" promover="' + userid + '"></div></div>';

					var r = '<div class="gang-member-actions"><div class="remove-member" remover="' + userid + '"></div><div class="promote-member" promover="' + userid + '"></div><div class="demote-member" rebaixar="' + userid + '"></div></div>';

				}

				else

				{

					$('.botao-editar').hide();

					var r5 = "";

					var r2 = "";

					var r = "";

				}

				

				if (ucargo == 1)

				{

				$(".gang-members.cargo" + ucargo + "").append(''

				 + '<div class="gang-member" style="width: 100%; !important">'

				 + '<div class="look"'

				 + 'style="background-image: url(https://cdn.leet.ws/leet-imaging/avatarimage?figure=' + look + '&direction=2&head_direction=2&gesture=agr&size=m;)"></div>'

				 + '<div class="gang-member-info">'

				 + '<div id="usuario-gangue" membro="' + userid + '">' + nome + ' (<b style="color:Red;">Chefe</b>)</div>'

				 + '<div class="online-status online"><img src ="/statics/img/online_' + online + '.png"></div>'

				 + '</div>'

				 + '</div>');

				}

				else if (ucargo == 2)

				{

				$(".gang-members.cargo" + ucargo + "").append(''

				 + '<div class="gang-member">'

				 + '<div class="look"'

				 + 'style="background-image: url(https://cdn.leet.ws/leet-imaging/avatarimage?figure=' + look + '&direction=2&head_direction=2&gesture=agr&size=m;)"></div>'

				 + '<div class="gang-member-info">'

				 + '<div id="usuario-gangue" membro="' + userid + '">' + nome + '</div>'

				 + '<div class="online-status online"><img src ="/statics/img/online_' + online + '.png"></div>'

				 + r2

				 + '</div>'

				 + '</div>');

				}

				else if (ucargo == 5)

				{

				$(".gang-members.cargo" + ucargo + "").append(''

				 + '<div class="gang-member">'

				 + '<div class="look"'

				 + 'style="background-image: url(https://cdn.leet.ws/leet-imaging/avatarimage?figure=' + look + '&direction=2&head_direction=2&gesture=agr&size=m;)"></div>'

				 + '<div class="gang-member-info">'

				 + '<div id="usuario-gangue" membro="' + userid + '">' + nome + '</div>'

				 + '<div class="online-status online"><img src ="/statics/img/online_' + online + '.png"></div>'

				 + r5

				 + '</div>'

				 + '</div>');

				}

				else

				{

				$(".gang-members.cargo" + ucargo + "").append(''

				 + '<div class="gang-member">'

				 + '<div class="look"'

				 + 'style="background-image: url(https://cdn.leet.ws/leet-imaging/avatarimage?figure=' + look + '&direction=2&head_direction=2&gesture=agr&size=m;)"></div>'

				 + '<div class="gang-member-info">'

				 + '<div id="usuario-gangue" membro="' + userid + '">' + nome + '</div>'

				 + '<div class="online-status online"><img src ="/statics/img/online_' + online + '.png"></div>'

				 + r

				 + '</div>'

				 + '</div>'); 

				}

				break;

			}

				case 'tlista':

				{

					var userid = eventData[1];

					var ucargo = eventData[2];

					var nome = eventData[3];

					var look = eventData[4];

					var online = eventData[5];

					var lider = eventData[6];

					

			

				

				if (ucargo == 1)

				{

				$(".tgang-members.cargo" + ucargo + "").append(''

				 + '<div class="tgang-member" style="width: 100%; !important">'

				 + '<div class="look"'

				 + 'style="background-image: url(https://cdn.leet.ws/leet-imaging/avatarimage?figure=' + look + '&direction=2&head_direction=2&gesture=agr&size=m;)"></div>'

				 + '<div class="gang-member-info">'

				 + '<div id="usuario-gangue" membro="' + userid + '">' + nome + ' (<b style="color:Red;">Chefe</b>)</div>'

				 + '<div class="online-status online"><img src ="/statics/img/online_' + online + '.png"></div>'

				 + '</div>'

				 + '</div>');

				}

				else if (ucargo == 2)

				{

				$(".tgang-members.cargo" + ucargo + "").append(''

				 + '<div class="tgang-member">'

				 + '<div class="look"'

				 + 'style="background-image: url(https://cdn.leet.ws/leet-imaging/avatarimage?figure=' + look + '&direction=2&head_direction=2&gesture=agr&size=m;)"></div>'

				 + '<div class="gang-member-info">'

				 + '<div id="usuario-gangue" membro="' + userid + '">' + nome + '</div>'

				 + '<div class="online-status online"><img src ="/statics/img/online_' + online + '.png"></div>'

				 + '</div>'

				 + '</div>');

				}

				else if (ucargo == 5)

				{

				$(".tgang-members.cargo" + ucargo + "").append(''

				 + '<div class="tgang-member">'

				 + '<div class="look"'

				 + 'style="background-image: url(https://cdn.leet.ws/leet-imaging/avatarimage?figure=' + look + '&direction=2&head_direction=2&gesture=agr&size=m;)"></div>'

				 + '<div class="gang-member-info">'

				 + '<div id="usuario-gangue" membro="' + userid + '">' + nome + '</div>'

				 + '<div class="online-status online"><img src ="/statics/img/online_' + online + '.png"></div>'

				 + '</div>'

				 + '</div>');

				}

				else

				{

				$(".tgang-members.cargo" + ucargo + "").append(''

				 + '<div class="tgang-member">'

				 + '<div class="look"'

				 + 'style="background-image: url(https://cdn.leet.ws/leet-imaging/avatarimage?figure=' + look + '&direction=2&head_direction=2&gesture=agr&size=m;)"></div>'

				 + '<div class="gang-member-info">'

				 + '<div id="usuario-gangue" membro="' + userid + '">' + nome + '</div>'

				 + '<div class="online-status online"><img src ="/statics/img/online_' + online + '.png"></div>'

				 + '</div>'

				 + '</div>'); 

				}

				break;

			}						

                       case 'gmembros':

                                 {

			       var membros = eventData[1];

				$("#gang-member-count").text(membros);



				break;		

                                 }

                        case 'tcargos':

			           {

			           

			       var g1 = eventData[1];

			       var g2 = eventData[2];

			       var g3 = eventData[3];

			       var g4 = eventData[4];

			       var g5 = eventData[5];

				$("#trank1").text(g1);

				$("#trank2").text(g2);

				$("#trank3").text(g3);

				$("#trank4").text(g4);

				$("#trank5").text(g5);

				break;

				}

				

			case 'gcargos':

			           {

			           

			       var g1 = eventData[1];

			       var g2 = eventData[2];

			       var g3 = eventData[3];

			       var g4 = eventData[4];

			       var g5 = eventData[5];

				$("#rank1").text(g1);

				$("#rank2").text(g2);

				$("#rank3").text(g3);

				$("#rank4").text(g4);

				$("#rank5").text(g5);

				break;

				}

				case 'gang': {

						 function lcargos()

		                          {

			                         $(".gang-members.cargo1").empty();

			                         $(".gang-members.cargo2").empty();

			                         $(".gang-members.cargo3").empty();

			                         $(".gang-members.cargo4").empty();

		 	                         $(".gang-members.cargo5").empty();

		                           }	

					if(extraData == "toggle")

						

					{

						if($('#inicio-gangue').is(":visible"))

						{

							$('#inicio-gangue').hide();
                            caixagangue = false;
							lcargos();

						}

						else

						{

					var gangid = eventData[2];

							if(gangid == "0")

							{

							    $('#inicio-gangue').show();
                                caixagangue = true;
								$("#semgangue").show();

					            $("#comgangue").hide();

							}

							else

							{

					
                            caixagangue = true;
							$('#inicio-gangue').show();	

					var name = eventData[3];

					var gmatou = eventData[4];

					var cor1 = eventData[5];

					var cor2 = eventData[6];

					var pmatou = eventData[7];

					var gmorreu = eventData[8];

					var username = eventData[9];

                    var level = eventData[10];

                    var meucargo = eventData[11];

                    var matei = eventData[12];

                    var ataqueipm = eventData[13];

                    var preso = eventData[14];

                    var fugas = eventData[15];

                    var dinamites = eventData[16];

                    var gfugiu = eventData[17];

                    var gpreso = eventData[18];

                    var gcapturou = eventData[19];

                    var xp1 = eventData[20];

                    var xp2 = eventData[21];

					$("#semgangue").hide();

					$("#comgangue").show();

					$("#xp-bar-text2").text(xp1 + "/" + xp2);

					$('#xp-barfill2').animate({

                        width: ((xp1 / xp2) * 100) + '%'

                    }, 200);

					$('.bubble.cargo').text(user.cargo);

					$('#gang-name').text('[' + gangid + '] ' + name);

					if (user.data == 1)

						$('.bubble.adm').show();

					else

						$('.bubble.adm').hide();

					$('#gangcolor1').css("background", cor1);

					$('#gangcolor2').css("background", cor2);

					

					$(".value").text(level);

					$("#st-eu").text(username);

					

					$("#gmatou1").text(gmatou);

					$("#gmorreu1").text(gmorreu);

					

					

					$("#gpreso1").text(gpreso);

					$("#gfugiu1").text(gfugiu);

					

			        $("#convidar-membro").show();

                    $("#st-eu").show();

					$("#meucargo").text(meucargo);

					$("#ataquei").text(matei);

					$("#matei").text(ataqueipm);

					$("#preso").text(preso);

					$("#fugi").text(fugas);

					$("#dinamites").text(dinamites);

				

							}

						}

					} if(extraData == "sair")

					{

						$("#semgangue").show();

					    $("#comgangue").hide();

					}

					else if(extraData == "goToGang")

					{

						

			           	$("#convidar-membro").show();

                        $("#st-eu").show();

					var gangid = eventData[2];					

                    var name = eventData[3];

					var gmatou = eventData[4];

					var cor1 = eventData[5];

					var cor2 = eventData[6];

					var pmatou = eventData[7];

					var gmorreu = eventData[8];

					var username = eventData[9];

                    var level = eventData[10];

                    var meucargo = eventData[11];

                    var matei = eventData[12];

                    var ataqueipm = eventData[13];

                    var preso = eventData[14];

                    var fugas = eventData[15];

                    var dinamites = eventData[16];

                    var gfugiu = eventData[17];

                    var gpreso = eventData[18];

                    var gcapturou = eventData[19];

                    var xp1 = eventData[20];

                    var xp2 = eventData[21];

                    var gmortos = eventData[22];

					$("#semgangue").hide();

					$("#comgangue").show();

					$("#xp-bar-text2").text(xp1 + "/" + xp2);

					$('#xp-barfill2').animate({

                        width: ((xp1 / xp2) * 100) + '%'

                    }, 200);

					$('.bubble.cargo').text(meucargo);

					$('#gang-name').text('[' + gangid + '] ' + name);

					if (user.data == 1)

						$('.bubble.adm').show();

					else

						$('.bubble.adm').hide();

					$('#gangcolor1').css("background", cor1);

					$('#gangcolor2').css("background", cor2);

					

					$(".value").text(level);

					$("#st-eu").text(username);

					$("#gatacou").text(user.gatacou);

					$("#gmatou").text(gmatou);

					$("#gpreso").text(gpreso);

					$("#gfugiu").text(fugas);

					$("#gturfs").text(gmorreu);

					$("#gmortes").text(gmortos);

					$("#meucargo").text(meucargo);

					$("#ataquei").text(user.ataquei);

					$("#matei").text(matei);

					$("#preso").text(preso);

					$("#fugi").text(fugas);

					$("#dinamites").text(dinamites);

					

					}

					break;

				}

				case 'vgangue': {
					if(extraData == "goToGang")
					{
			     	$("#target-gangue").show();
					var gangid = eventData[2];
					var name = eventData[3];
					var glevel = eventData[4];
					var cor1 = eventData[5];
					var cor2 = eventData[6];
					var gmatou = eventData[7];
					var gmorreu = eventData[8];
					var membros = eventData[9];
					var gpreso = eventData[10];
			        var gfugiu = eventData[11];
					var xp1 = eventData[12];
					var xp2 = eventData[13];
                    $("#tgang-member-count").text(membros);
					$("#targetgangue").show();
					$("#xpbar-texto").text(xp1 + "/" + xp2);
					$('#xp-barra-fill').animate({
                        width: ((xp1 / xp2) * 100) + '%'
                    }, 200);
                	$('.bubble.cargo').text(user.cargo);
					$('#tgang-name').text('[' + gangid + '] ' + name);
					$('#tgangcolor1').css("background", cor1);
					$('#tgangcolor2').css("background", cor2);
				

					$("#targetlevel").text(glevel);

					$("#gmatou").text(gmatou);

					$("#gmortes").text(gmorreu);

					$("#gpreso").text(gpreso);

					$("#gfugiu").text(gfugiu);

					

					}

					break;

				}

				case 'perfil':

				    var roupa = "https://avatar.habblive.net/habbo-imaging/avatarimage?figure=";

					var nome = eventData[1];

					var id = eventData[2];

					var visual = eventData[3];

					var nivel = eventData[4];

					var fome = eventData[5];

					var forca = eventData[6];

					var mortes = eventData[7];

					var socos = eventData[8];

					var kills = eventData[9];

					var arrests = eventData[10];

					var motto = eventData[11];

					var criado = eventData[12];

					var xp = eventData[13];

					var xp2 = eventData[14];

					

					var empregoid = eventData[15];

					var emprego = eventData[16];

					var bemprego = eventData[17];

					var logadoult = eventData[18];

					var energia = eventData[19];

					var maxenergia = eventData[20];

					var fugas = eventData[21];

					var turnos = eventData[22];

					var cargo = eventData[23];

					var gangname = eventData[24];

					var gangrank = eventData[25];

					var ganglevel = eventData[26];

					var color1 = eventData[27];

					var color2 = eventData[28];

					var gangueid = eventData[29];

					var mateigangue = eventData[30];

					var morrigangue = eventData[31];

					var socosgangue = eventData[32];

					if (id == user.id) {

                        $('#ed-bio').show();

                    }

                    else {

                        $('#ed-bio').hide();
                       bioeditar = false;
                        $('#digitar-bio').hide();

                        $('#sv-bio').hide();

                        $('#cl-bio').hide();

                    }

                    $('#profile').css('content', 'url(' + roupa + visual + '&direction=2&headonly=0)');

                    $('#login').text(logadoult + '');

                    $('#statstitle').text('Perfil de ' + nome + '');

                    

                    $('#nivl').text(nivel);

                    document.getElementById("nomeplayer").innerHTML = nome;

                    document.getElementById("hung").innerHTML = fome + ("/100");

                    document.getElementById("energia").innerHTML = energia + ("/" + maxenergia);

                    document.getElementById("str").innerHTML = forca;

                    document.getElementById("arrests").innerHTML = arrests;

                    document.getElementById("deaths").innerHTML = mortes;

                    document.getElementById("punches").innerHTML = socos;

                    document.getElementById("kills").innerHTML = kills;

                    document.getElementById("fugas").innerHTML = fugas;

                    document.getElementById("gangkills2").innerHTML = mateigangue;

                    document.getElementById("gangarrests2").innerHTML = morrigangue;

                    document.getElementById("ganghits2").innerHTML = socosgangue;

                    $("#frase-bio").text('' + motto + '');

                    $("#registro").text('Conta criada: ' + criado + '');



                    $('#xp_inner').css({

                        width: ((xp / xp2) * 100) + '%'

                    }, 200);

                    $('#xp_text').text((xp) + '/' + (xp2));

                    $('#online').css('content', 'url(/' + user.online + '.png)');

					

                    if (gangname == '<b>null</b>' || gangname == 'null' || gangname == null) {

                        $('#gang_title').html('Nome: <b>Nenhuma gangue</b>');

                        $('#gangrank_name').html('Cargo: <b>Nenhum</b>');

                        $('#gang_level').html('Level: <b>0</b>');

                        $('#gang_color1').css("background", 'white');

                        $('#gang_color2').css("background", 'white');

						$('.vmais').hide();

                    } else {



                        $("#gang_title").html("Nome: " + gangname + "");

                        $("#gangrank_name").html("Cargo: " + gangrank + "");

                        $("#gang_level").html("Level: <b>" + ganglevel + "</b>");

                        $('#gang_color1').css("background", color1);

                        $('#gang_color2').css("background", color2);

                        $('#gang_color1').show();

                        $('#gang_color2').show();

						$('.vmais').attr('id', gangueid);

						$('.vmais').show();

                    }



                    if (empregoid == '1') {

                        $('#jobtitle').text('Desempregado');

                        $("#jobtitle").css('left', 202);

                        $("#jobtitle").css('top', 120);

                        $('#turnos').hide();

                        $('#jobbadge').css('content', 'url(http://hycerp.org/habbo-imaging/corp/' + bemprego + '.gif)');

                    } else {

                        $('#jobbadge').css('content', 'url(http://hycerp.org/habbo-imaging/corp/' + bemprego + '.gif)');

                        $('#jobtitle').text(emprego);

                        document.getElementById("jobshift").innerHTML = cargo;

                        document.getElementById("completos").innerHTML = turnos;

                        $("#jobtitle").css('left', 202);

                        $("#jobtitle").css('top', 120);

                        $('#turnos').show();

                    }

                    $('.container-perfil').show();

                    break;

				case 'profilUser': {

					$('#profilUser #profilUsernameTitle').html(extraData);

					var userId = eventData[2];

					$('#profilUser').show();

					break;

				}				

				case 'compose_roomcount': {

					

					var count = eventData[1];

					

					$('#pessoasquarto').hide(10, function(){

						$('#pessoasquarto').html(count).show(5);

					});

					

					break;

				}

				case 'compose_newonlinecount': {

					

					var count = eventData[1];

					

					$('#pessoashotel').hide(100, function(){

						$('#pessoashotel').html(count).show(90);

					});

					

					break;

				}	

				case 'removerp':{

					var look = eventData[1];

					var userid = eventData[2];

					var nome = eventData[3];

					var lastquarto = eventData[4];

					var estrelas = eventData[5];
					if(extraData == "clear")
					{
                    $('#procs').empty();

					}
				    break;

				}

				

				case 'procurados':{

					var look = eventData[1];

					var userid = eventData[2];

					var nome = eventData[3];

					var lastquarto = eventData[4];

					var estrelas = eventData[5];
				   $('#procs').append('<div class="corpo-info-proc" id="' + userid + '"><div class="corpo-procs"><div class="foto-users" style="background-image: url(https://www.habbo.com/habbo-imaging/avatarimage?figure=' + look + '&direction=3&head_direction=3&gesture=agr);"></div><div class="user-nome-id"><div class="corpo-nome">[' + userid + '] ' + nome + '</div><ul><li>Visto por Ultimo: [ID: ' + lastquarto + ']</li></ul></div><div class="estrelas-proc e' + estrelas + '"></div></div></div>');					

				    break;
				}

				case 'comandos': {

				var type = eventData[1];		

				if(type == "abrir")

					{

                       $("#civil").attr("class", "v-cmd lei-selecionada");

                       $("#trabalho").attr("class", "v-cmd");

                       $("#crime").attr("class", "v-cmd");

                       $("#vip").attr("class", "v-cmd");

                       $("#eqp").attr("class", "v-cmd");

                       $("#receber-comandos").empty();

                       $(".container-comandos").show();

                       $("#receber-comandos").load("/civil");				

					}

					break;

				}

				case 'taximapa': {

				var type = eventData[1];		

				if(type == "abrir")

					{

					 $("#corpo-cidade").show();
                     taximapa = true;
				     $('.corpo-quartos').load("/taximapa");					

					}

					else if(type == "limpar")

					{

					$('.corpo-quartos').empty();

					}

					else if(type == "fechar")

					{
                     taximapa = false;

					$('.corpo-quartos').empty();

					 $("#corpo-cidade").hide();

					}

					break;

				}

				case 'compose_newonlinecount': {

					

					var count = eventData[1];

					

					$('#quarto').fadeout(500, function(){

						$('#quarto').html(count).show(50);

					});

					

					break;

				}

				case 'compose_arrowmovement': {

					

					var enable = eventData[1];

					

					if(enable == 'yes')

					{

						app['bindWalking']();

					}

					else

					{

						app['unbindWalking']();

					}

					

					break;

				}

				

				case 'compose_ping': {

					

				

					break;

				}
				case 'taxitempo': {
					var type = eventData[1];
					var tempo = eventData[2];
    					if(type == "abrir")
					{			
                        var tempo2 = tempo * 2;			
                        $('.TimedActionBar_wrapper_3v6DC').show();
				        $("#tempo-sec").text(tempo);
                        $(".TimedActionBar_progress_3O0KH").css('width', tempo2 + '%');
					} 
				    else if(type == "fechar")
					{
                        $('.TimedActionBar_wrapper_3v6DC').hide();
				        $("#tempo-sec").text(0);
                        $(".TimedActionBar_progress_3O0KH").css('width', 0);
					}
					break;
				}
				case'ads':{

				

					$("#ad").show();

			$("#ad-timer").show();

		contagem1 = 60;

				    counter = document.getElementById('ad-timer');

				    counter.innerText = contagem1;

				    i = setInterval(function(){

				        $("#ad-timer").show();

				        --contagem1;

				        if (contagem1 === 0){

				            clearInterval(i);

				            $("#ad-timer").hide();

					$("#ad").hide();

				        }

				        counter.innerText=contagem1;

				    },1000);

					$("#ad-close").show(30000);

		

		        $("#ad-close").click(function(e) {

            if (e.button == 0) {

                $("#ad").hide();

                return false;

            }

        });

		 break;

		}

				

				case'inventario':{

				    

	$("#ad").show();

			$("#ad-timer").show();

		contagem2 = 60;

				    counter = document.getElementById('ad-timer');

				    counter.innerText = contagem2;

				    i = setInterval(function(){

				        $("#ad-timer").show();

				        --contagem2;

				        if (contagem2 === 0){

				            clearInterval(i);

				            $("#ad-timer").hide();

					$("#ad").hide();

				        }

				        counter.innerText=contagem2;

				    },1000);

					$("#ad-close").show(30000);

		

		        $("#ad-close").click(function(e) {

            if (e.button == 0) {

                $("#ad").hide();

                return false;

            }

        });

        

				                    $('.container-inventario').show();

				                    break;

				}

				case 'compose_characterbar': {

					app['loadStatistics'](extraData);

					break;

				}				

				case 'trocas': {

				var type = eventData[1];			

				if(type == "fechar")

					{

					$('#tradeUser').hide();
					trocando = false;

					}

					else if(type == "abrir")

					{

					}

					break;

				}

				case 'territorio': {

				var type = eventData[1];	

				var turf1 = eventData[2];	

				var turf2 = eventData[3];	

				var time1 = eventData[4];		

				var time2 = eventData[5];			

				if(type == "show")

					{

					$('.turf-1A33A_0').show();

                    document.getElementById("turf1").innerHTML = turf1;

                    document.getElementById("turf2").innerHTML = turf2;

					}

					else if(type == "atualizar")

					{

                    document.getElementById("turf1").innerHTML = turf1;

                    document.getElementById("turf2").innerHTML = turf2;

					}

					else if(type == "botao")

					{

					$('#capturar').hide();

					$('#capturando-bar').show();

					console.log(eventData[2]);

					 var tempo = Math.ceil((((turf1 / 115)) ) * 230);

					$('#barra-tempocapture').animate({width: tempo + 'px'});

					}

					else if(type == "botaohide")

					{

					$('#barra-tempocapture').animate({width: 0 + 'px'});

					$('#capturar').show();

					$('#capturando-bar').hide();

					}

					else if(type == "stop")

					{

					$('.turf-1A33A_0').hide();

					}

					break;

				}

		         case "compose_coins": {

					

					var Coins = UserData[1];

					

		        }

				case 'compose_clear_characterbar': {

					app['loadStatistics'](extraData, true);

				}

				

				case "compose_atm": {

					

					var Action = jQuery.trim(extraData);

					var UserData = (jQuery.trim(eventData[2])).split(',');

					var HasBank = (UserData[0] == "1" ? true : false);

					var ChequingsBalance = UserData[1];

					var SavingsBalance = UserData[2];					

		

		

					switch(Action)

					{

						case "open":

							$('#ActivityOverlay').show();

							$('#AtmMachine').addClass('oAtmMachine').show();
                            atm = true;
							$('.c_amt').html(ChequingsBalance);

							$('.s_amt').html(SavingsBalance);						

						break;

						case "error":

							var Error = eventData[2];

							$('#AtmCloseBtn').html('<div class="AtmError" style="position:absolute;top: -1028%;left: -222%;font-size: 10px;color: white;width: 300px;background: #aa7200;height: 10px;font-weight: bold;text-align: center;border: 2px solid #ffdd00;padding: 5px;line-height: 10px;border-radius: 2px;">' + Error + '</div>');

						break;	

						case "change_balance_1":

							var Amount = eventData[2];

							$('.c_amt').html(Amount);

						break;

						case "change_balance_2":

							var Amount = eventData[2];

							$('.s_amt').html(Amount);

						break;

						default:

							//alert(Action);

						break;

					}				

					break;

				}

					

				case "compose_htmlpage": {

				

					var page = (event.data.split(',')[0]).split(':')[1];

					var action = (event.data.split(',')[1]).split(':')[1];

					

					$.ajax({

						type: "POST",

						url: "/resources-ajax/settings/" + page + ".php",

						cache: false,

						data: {

							

						}	

					}).done(function(data) {

						$('.PageElement').html(data);

					});				

					break;

				}

				

				case 'transaction': {

					var msg = eventData[1];

					var price = eventData[2];

					user.payement = false;

					if(price > 19)

					{

						user.payement = true;

					}

					

					if( msg.indexOf('gang') >= 0){

						$('#transaction h1').html("Convite para Gangue");

					}

					else

					{

					}

					

					$('#transaction .transaction .transaction_choice').show();

					$('#transaction .transaction .transaction_moyen').hide();

					$('#transaction .transaction .code').hide();

					$('#texto-trocas').html(msg);

					$("#trocar-item").show();

					break;

				}

				case 'status': {

					var moedas = extraData;

					var duckets = eventData[2];

					var eventPoint = eventData[3];

					if (moedas < 9999)

					{

						totalvalor = moedas;

					}

					else if (moedas < 1000000)

					{

						totalvalor = Math.round(moedas/1000) + "K";

					}

					else if (moedas < 10000000)

					{

						totalvalor = Math.round(moedas/1000000).toFixed(2) + "M";

					}

					else if (moedas < 1000000000)

					{

						totalvalor = Math.round((moedas/1000000)) + "M";

					}

					else if (moedas < 1000000000000)

					{

						totalvalor = Math.round((moedas/1000000000)) + "B";

					}

					$("#moedas").text("$" + totalvalor);

					break;

				}

				

				case 'trade': {

					if(extraData == "initTrade")

					{

						$("#tradeUser .myProposition img").attr("src", "https://www.habbo.com/habbo-imaging/avatarimage?figure=" + eventData[3]);

						$("#tradeUser .otherProposition img").attr("src", "https://www.habbo.com/habbo-imaging/avatarimage?figure=" + eventData[4]);

						$('#tradeUser .tradeUserUsername').html(eventData[2]);

						$('#tradeUser .my_items li').hide();

						

						var items = eventData[5];

						var itemsData = items.split('/');

						

						$.each(itemsData, function(i, obj){

							var itemsDataRow = itemsData[i].split('-');

							var itemsDataRowName = itemsDataRow[0];

							var itemsDataRowParameter = itemsDataRow[1];
console.log(itemsDataRowName);
console.log(itemsDataRowParameter);
							if(itemsDataRowName != null && itemsDataRowName != "")

							{

								if(itemsDataRowParameter != null && itemsDataRowParameter != "")

								{

									$("#tradeUser .my_items li#" + itemsDataRowName+ " .number").html(itemsDataRowParameter);

								}

								$("#tradeUser .my_items li#" + itemsDataRowName).show();

							}

						})

			

						$("#tradeUser .montantTrade").hide();

						$("#tradeUser #ValideTradeButton").prop("disabled",false);

						$("#tradeUser .myProposition .valideTrade, #tradeUser .otherProposition .valideTrade").removeClass("checked");

						$("#tradeUser #myPropositionTrade, #tradeUser #otherPropositionTrade").html("<li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li>");

						$("#tradeUser").show();
						trocando = true;

					}

					

					if(extraData == "cancelTrade")

					{

						trocando = false;
						$("#tradeUser").hide();

					}

					

					if(extraData == "errorMontantTrade")

					{

						$("#tradeUser .montantTrade input[type=text]").focus();

						$("#tradeUser .montantTrade input[type=text]").effect("bounce", { times:5 }, 1000);

					}

					

					if(extraData == "valideTrade")

					{

						var whoConfirm = eventData[2];

						if(whoConfirm == "me")

						{

							$("#tradeUser #ValideTradeButton").prop("disabled",true);

							$("#tradeUser .myProposition .valideTrade").addClass("checked");

						}

						else

						{

							$("#tradeUser .otherProposition .valideTrade").addClass("checked");

						}

					}

					

					if(extraData == "removeItems")

					{

						var whoRemove = eventData[2];

						var name = eventData[3];

						var parameter = eventData[4];

						

						$("#tradeUser #ValideTradeButton").prop("disabled",false);

						$("#tradeUser .myProposition .valideTrade, #tradeUser .otherProposition .valideTrade").removeClass("checked");

						

						if(whoRemove == "me")

						{

							$("#tradeUser #myPropositionTrade li#" + name).remove();

							$("#tradeUser #myPropositionTrade").html($("#tradeUser #myPropositionTrade").html() + "<li></li>");

							if(parameter != "noParameter" && parameter != "")

							{

								$("#tradeUser .my_items li#" + name+ " .number").html(parameter);

							}

							$("#tradeUser .my_items li#" + name).show();

						}

						else

						{

							$("#tradeUser #otherPropositionTrade li#" + name).remove();

							$("#tradeUser #otherPropositionTrade").html($("#tradeUser #otherPropositionTrade").html() + "<li></li>");

						}

					}

					

					if(extraData == "addItems")

					{

						var whoAdd = eventData[2];

						var name = eventData[3];

						var parameter = eventData[4];

						var image = eventData[5];

						var newNumber = eventData[6];

						

						$("#tradeUser #ValideTradeButton").prop("disabled",false);

						$("#tradeUser .myProposition .valideTrade, #tradeUser .otherProposition .valideTrade").removeClass("checked");

						

						if(whoAdd == "me")

						{

							if(newNumber == "0")

							{

								$("#tradeUser .my_items li#" + name).hide();

							}

							else

							{

								$("#tradeUser .my_items li#" + name + " .number").html(newNumber);

							}

							

							var montant = $("#tradeUser .montantTrade").hide();

							

							var myTrade = $("#tradeUser .myProposition #myPropositionTrade").html();

							if(parameter == "0")

							{

								myTrade = myTrade.replace("<li></li>", '<li id="' + name + '"><img src="' + image + '"></li>');

							}

							else

							{

								myTrade = myTrade.replace("<li></li>", '<li id="' + name + '"><img src="' + image + '"><div class="number">' + parameter + '</div></li>');

							}

							$("#tradeUser .myProposition #myPropositionTrade").html(myTrade);

						}

						else

						{

							var hisTrade = $("#tradeUser .otherProposition #otherPropositionTrade").html();

							if(parameter == "0")

							{

								hisTrade = hisTrade.replace("<li></li>", '<li id="' + name + '"><img src="' + image + '"></li>');

							}

							else

							{

								hisTrade = hisTrade.replace("<li></li>", '<li id="' + name + '"><img src="' + image + '"><div class="number">' + parameter + '</div></li>');

							}

							

							$("#tradeUser .otherProposition #otherPropositionTrade").html(hisTrade);

						}

					}

					

					break;

				}

				

				

				

				case "compose_timer": {

					

					var Timer = (event.data.split(',')[0]).split(';')[1];

					var Action = (event.data.split(',')[1]).split(';')[1];

					var Value = (event.data.split(',')[2]).split(';')[1];

					

					var DisplayName = Timer.split('-')[0] + " " + Timer.split('-')[1];

					var TimerDialogue = $('.' + Timer.split('-')[0].toLowerCase() + "" + Timer.split('-')[1].toLowerCase());

					

					switch(Action)

					{

						case "add":

						case "adicionar":

						

							TimerDialogue.html('Tempo: ' + Value).show();

							

						break;

						

						case "remove":

							

							TimerDialogue.hide();

						

						break;

						

						case "decrement":

							

							TimerDialogue.html('Tempo: ' + Value);

						

						break;

					}

					

					break;

				}		

				case 'alertahotel':

					var msg = eventData[1];

                    $('.hotelAlertWrapper-1MZsz_0').css('display', 'flex').show();

                    $('#hamsg').html(msg);

					setTimeout(function(){$('.hotelAlertWrapper-1MZsz_0').fadeOut(); }, 15000);

                    break;

                

				case "compose_captchabox": {

					

					var captchaData = extraData;

					var captchaParts = captchaData.split(',');

					

					var Title = captchaParts[1];

					var GeneratedString = captchaParts[2];

					

										

					

					$('#captcha-box').show();
                    captcha = true;
                    
					var figure = "/swf/c_images/notifications/imager.php?username=" + user.name + "&headonly=1&gesture=sml?1";
					$(".captcha-box-avatar").css({background: 'url(' + figure + ')'});
					$('.captcha-box-information').fadeIn().html(Title).show();

					$('.captcha-box-generatedtxt').fadeIn().text(GeneratedString).show();

					

				}

				

				

				case 'transaction': {

					var msg = eventData[1];

					var price = eventData[2];

					user.payement = false;

					if(price > 19)

					{

						user.payement = true;

					}

					

					if( msg.indexOf('gang') >= 0){

						$('#transaction h1').html("Convite para Gangue");

					}

					else

					{

					}

					

					$('#transaction .transaction .transaction_choice').show();

					$('#transaction .transaction .transaction_moyen').hide();

					$('#transaction .transaction .code').hide();

					$('#transaction .transaction .transaction_choice h2').html(msg);

					$("#transaction").show();

					break;

				}

				

				case "compose_chat": {



					user.chatMgr.handleData(event.data);

					

					break;

				}

				

				default: { 

					

				break;

				}



			}

        };

      

		

   },

	

	unbindWalking: function() {

		$(document).unbind('keydown');

		$(document).unbind('keyup');

	},

	

	

	bindPhone: function () {

		$(document).delegate('#celular-icon', 'click', function(){

			if(user.canUsePhone == false)

				return;



			if ($('#phone').hasClass('close')) 

			{

				$("#phone").animate({

					marginBottom: '470px'

				});

				$("#phone").removeClass("close");

				var text = $('#phone #menu #tel_sms .notifications').text();

				if(text == "0") 

				{

					$('#phone #menu #tel_sms .notifications').hide();

				}

				else

				{

					$('#phone #menu #tel_sms .notifications').show();

				}

				var data = 'open';

				app['sendData']('telephone', data, false, false);

			}

			else

			{

				if(user.appel == false)

				{

					$("#phone").animate({

						marginBottom: '-=500px'

					}, 500);

					var data = 'close';

					app['sendData']('telephone', data, false, false);

					$("#phone").addClass("close");

				}

			}

		});

		

		$(document).delegate('#phone #home', 'click', function(){

			if(user.canUsePhone == false)

				return;

			

			$('#phone #sms').hide();

			$('#phone #sms_user').hide();
			caixasms = false;

			$('#phone #contacts').hide();

			$('#phone #calculatrice').hide();

			$('#phone #banque').hide();

			$('#phone #appel').hide();

			$('#phone #appel_user').hide();
            caixaligar = false;
		
			$('#phone #facebook').hide();

			$('#phone #youtube #yt_iframe').attr('src', 'https://www.youtube.com/embed/?autoplay=1');

			$('#phone #youtube').hide();

			$('#phone #bouygues').hide();

			$('#phone #flappy').hide();

		$('#phone #banqueIni').hide();

			$('#phone #banqueTrans').hide();

			$('#phone #banqueInvest').hide();

			$('#phone #jornalHyce').hide();

			$('#phone #jornalHyceIni').hide();

			$('#phone #jornalHyceArt').hide();

			$('#phone #fooble').hide();

			$('#phone #lojareal').hide();

			$('#phone #tagone').hide();

			$('#phone #mapatotal').hide();


			var text = $('#phone #menu #tel_sms .notifications').text();

			if(text == "0") 

			{

				$('#phone #menu #tel_sms .notifications').hide();

			}

			else

			{

				$('#phone #menu #tel_sms .notifications').show();

			}

			$('#phone #menu').fadeIn("slow");

		});

		
        $(document).delegate('.button-apptm', 'click', function() {
			
			var data = "buy";
            app['sendData']('apartamentos', data, false, false);
        });
		$(document).delegate('#phone #menu #tel_phone', 'click', function(){

			if(user.canUsePhone == false)

				return;

			

			$('#phone #menu').hide();

			

			if(user.appel == true)

			{

				$('#phone #appel_user').hide();

		       caixaligar = true;
				$('#phone #appel').fadeIn("slow");

			}

			else

			{

				$('#phone #appel').hide();

		      caixaligar = true;
				$('#phone #appel_user').fadeIn("slow");

			}

		});

		$(document).delegate('#phone #menu #tel_botaoJornal', 'click', function(){

            if(user.canUsePhone == false)

                return;

            $('#phone #menu').hide();

            $('#phone #botaoJornal').fadeIn("slow");

        });



        $("#phone #menu #tel_botaoJornal1").click(function () {

            if(user.canUsePhone == false)

                return;

            $('#phone #menu').hide();

            $('#phone #botaoJornal1').fadeIn("slow");

        });



		$(document).delegate('#phone #menu #tel_botaoBanqueIni', 'click', function(){

            if(user.canUsePhone == false)

                return;

            $('#phone #menu').hide();

            $('#phone #banqueIni').fadeIn("slow");

        });

		$(document).delegate('#phone #menu #tel_tagone', 'click', function(){

            if(user.canUsePhone == false)

                return;

            $('#phone #menu').hide();

            $('#phone #tagone').fadeIn("slow");

        });

		$(document).delegate('#phone #menu #tel_mapatotal', 'click', function(){

            if(user.canUsePhone == false)

                return;

            $('#phone #menu').hide();

            $('#phone #mapatotal').fadeIn("slow");

        });

		$(document).delegate('#phone #menu #tel_botaoBanque1', 'click', function(){

            if(user.canUsePhone == false)

                return;

            $('#phone #menu').hide();

            $('#phone #botaoBanque1').fadeIn("slow");

        });

		

		$(document).delegate('#phone #sms_user .call', 'click', function(e){

			if(user.canUsePhone == false)

				return;

			

			var username = $(this).attr('id');

			var data = "appel_user," + username;

			app['sendData']('telephone', data, false, false);

		});



		$(document).delegate('#phone #menu #tel_facebook', 'click', function(){

			if(user.canUsePhone == false)

				return;

			

			$('#phone #menu').hide();

			$('#phone #facebook').fadeIn("slow");

		});

		

		
		$(document).delegate('#phone #menu #tel_banque', 'click', function(){


			if(user.canUsePhone == false)

				return;

			

			var data = 'banque';

			app['sendData']('telephone', data, false, false);

		});

		
		$(document).delegate('#phone #menu #tel_bouygues', 'click', function(){


			if(user.canUsePhone == false)

				return;

			

			var data = 'bouygues';

			app['sendData']('telephone', data, false, false);

		});

		
		$(document).delegate('#phone #tel_youtube', 'click', function(){


			if(user.canUsePhone == false)

				return;

			

			var data = 'youtube';

			app['sendData']('telephone', data, false, false);

		});

		
		$(document).delegate('#phone #bouygues #resetForfait', 'click', function(){


			if(user.canUsePhone == false)

				return;

			

			var data = 'renouveler';

			app['sendData']('telephone', data, false, false);

		});

		
		$(document).delegate('#phone #menu #tel_calculatrice', 'click', function(){


			if(user.canUsePhone == false)

				return;

			

			$('#phone #menu').hide();

			$('#phone #calculatrice').fadeIn("slow");

		});
		$(document).delegate('#phone #menu #tel_taxi', 'click', function(){

			if(user.canUsePhone == false)

				return;

			

			$('#phone #menu').hide();

			$('#phone #taxi').fadeIn("slow");

		});	

	     $("#phone #menu #tel_maptot").click(function () {

			if(user.canUsePhone == false)

				return;

			

			$('#phone #menu').hide();

			$('#phone #maptot').fadeIn("slow");

		});	

		$("#phone #menu #tel_lojareal").click(function () {

			if(user.canUsePhone == false)

				return;

			

			$('#phone #menu').hide();

			$('#phone #lojareal').fadeIn("slow");

		});	

	    $("#phone #menu #tel_jornalHyce").click(function () {

			if(user.canUsePhone == false)

				return;

			

			$('#phone #menu').hide();

			$('#phone #jornalHyce').fadeIn("slow");

		});	

	    $("#phone #menu #tel_corpUser").click(function () {

			if(user.canUsePhone == false)

				return;

			

			$('#phone #menu').hide();

			$('#phone #corpUser').fadeIn("slow");

		});		

		$(document).delegate("#phone #menu #tel_fooble", 'click', function(){

			if(user.canUsePhone == false)

				return;

			

			$('#phone #menu').hide();

			$('#phone #fooble').fadeIn("slow");

		});

		

		$(document).delegate('#phone #contacts .call', 'click', function(e){

			if(user.canUsePhone == false)

				return;

			

			var username = $(this).attr('id');

			var data = "appel_user," + username;

			app['sendData']('telephone', data, false, false);

		});

		

		$(document).delegate('#phone #contacts .sms', 'click', function(e){

			if(user.canUsePhone == false)

				return;

			

			var userId = $(this).attr('id');

			user.ActiveSms = userId;

			$('#phone #contacts').hide();

			$('#phone #sms_user').load("/conversar/" + user.id + "/" + userId);

			$('#phone #sms_user').fadeIn("slow");

			caixasms = true;
		});

		

		$(document).delegate('#phone #contacts .delete', 'click', function(e){

			if(user.canUsePhone == false)

				return;

			

			var userId = $(this).attr('id');

			var data = "delete," + userId;

			app['sendData']('telephone', data, false, false);

		});

		

		$(document).delegate('#phone #calculatrice .number', 'click', function(){


			if(user.canUsePhone == false)

				return;

			

			var thisNumber = $(this).attr('id');

			$("#phone #calculatrice #resultat").html($('#phone #calculatrice #resultat').html() + thisNumber);

		});

		
		$(document).delegate('#phone #calculatrice .clean_button', 'click', function(){

			if(user.canUsePhone == false)

				return;

			

			$("#phone #calculatrice #resultat").html("");

		});

		
		$(document).delegate('#phone #calculatrice .btn_plus', 'click', function(){

			if(user.canUsePhone == false)

				return;

			

			$("#phone #calculatrice #resultat").html($('#phone #calculatrice #resultat').html() + "+");

		});

		

		$(document).delegate('#phone #calculatrice .btn_moins', 'click', function(){

			if(user.canUsePhone == false)

				return;

			

			$("#phone #calculatrice #resultat").html($('#phone #calculatrice #resultat').html() + "-");

		});

		

		$(document).delegate('#phone #calculatrice .btn_division', 'click', function(){

			if(user.canUsePhone == false)

				return;

			

			$("#phone #calculatrice #resultat").html($('#phone #calculatrice #resultat').html() + "/");

		});

		

		$(document).delegate('#phone #calculatrice .btn_multi', 'click', function(){

			if(user.canUsePhone == false)

				return;

			

			$("#phone #calculatrice #resultat").html($('#phone #calculatrice #resultat').html() + "*");

		});

		
		$(document).delegate('#phone #calculatrice .btn_egal', 'click', function(){


			if(user.canUsePhone == false)

				return;

			

			var egal = eval($('#phone #calculatrice #resultat').html());

			$("#phone #calculatrice #resultat").html(egal);

		});

		

		$(document).delegate('#phone .eteindre', 'click', function(){

			if(user.canUsePhone == false)

				return;

			

			if(user.appel == true)

				return;

			

			$('#phone #sms').hide();

			$('#phone #sms_user').hide();

			$('#phone #contacts').hide();

			$('#phone #banque').hide();

			$('#phone #bouygues').hide();

			$('#phone #facebook').hide();

			$('#phone #banqueIni').hide();

			$('#phone #banqueTrans').hide();

			$('#phone #banqueInvest').hide();

			$('#phone #jornalHyce').hide();

			$('#phone #jornalHyceIni').hide();

			$('#phone #jornalHyceArt').hide();

			$('#phone #fooble').hide();

			$('#phone #lojareal').hide();

			$('#phone #tagone').hide();

			$('#phone #mapatotal').hide();

			$('#phone #appel_user').hide();
           caixasms = false;
		   caixaligar = false;
			$('#phone #youtube #yt_iframe').attr('src', '');

			$('#phone #youtube').hide();

			$('#phone #appel').hide();

			$('#phone #menu').fadeIn("slow");

				

			$("#phone").animate({

				marginBottom: '-490px'

			});

			$("#phone").addClass("close");

			var data = 'eteindre';

			app['sendData']('telephone', data, false, false);

		});

	

		$(document).delegate('#phone #appel_user #appel_user_button', 'click', function(){

			if(user.canUsePhone == false)

				return;

			

			var data = 'appel_user,' + $("#appel_user_userId").val();

			app['sendData']('telephone', data, false, false);

		});

		

		$(document).delegate('#appel #repondre', 'click', function(){

			if(user.canUsePhone == false)

				return;

			

			user.AudioSonnerie.pause();

			user.AudioSonnerie.currentTime = 0;

			var data = 'decrocher';

			app['sendData']('telephone', data, false, false);

		});

		
		$(document).delegate('#appel #raccrocher', 'click', function(){

			if(user.canUsePhone == false)

				return;

			

			user.AudioSonnerie.pause();

			user.AudioSonnerie.currentTime = 0;

			var data = 'raccrocher';

			app['sendData']('telephone', data, false, false);

		});

	},

	

	

		bindGang: function () {



		$(document).delegate('#gang i.give_owner', 'click', function(e){

			var data = "owner," + $(this).attr('id');

			app['sendData']('gang', data, false, false);

		});



	},



	

	bindWalking: function() {

		

		

		$(document).keydown(function(e) {

			

			app['walking'] = true;

			clearTimeout(app['walkingInterval']);

			

			var key = "";

			

			switch(e.which) {

				case 37: 

					key = "Left";

				break;



				case 38:

					key = "Up";

				break;



				case 39:

					key = "Right";

				break;



				case 40:

					key = "Down";

				break;



				default: return;

			}

			

			if(key == "")

				return;

			

			

			app['sendData']('event_walk', key, false, false);

			app['walking'] = true;

			

			

		}).keyup(function(){

			

			app['walking'] = false;

			

			app['walkingInterval'] = setTimeout(function(){

				

				if(app['walking'] == true)

					return;

				

				app['sendData']('event_walk', "stop", false, false);

				

			}, 500);	

		});

		

	},

	

	bindTrade: function () {

		$(document).delegate('#tradeUser .close, #tradeUser #CancelTradeButton', 'click', function(){

			var data = 'cancelTrade';

			app['sendData']('trade', data, false, false);

		});

		

		$(document).delegate('#tradeUser .close, #tradeUser #ValideTradeButton', 'click', function(){

			var data = 'confirmTrade';

			app['sendData']('trade', data, false, false);

		});

		

		$(document).delegate('#tradeUser .montantTrade #montantTradeButton', 'click', function(){

			var activeItem = $("#tradeUser .my_items").find(".active");

			var name = activeItem.attr('id');

			var image = activeItem.find('img')[0].src;

			var montant = $("#tradeUser .montantTrade #montantTradeInputMontant").val();

			var data = 'addItems,' + name + ',' + montant + ',' + image;

			app['sendData']('trade', data, false, false);

		});

		

		$(document).delegate('#tradeUser .my_items li', 'click', function(){

			$("#tradeUser .my_items li").removeClass("active");

			$(this).addClass("active");

			

			if ($(this).hasClass('choose')) {

				$("#tradeUser .montantTrade").slideDown();

			}

			else

			{

				$("#tradeUser .montantTrade").hide();

				var name = $(this).attr('id');

				var image = $(this).find('img')[0].src;

				

				var data = 'addItems,' + name + ',0,' + image;

				app['sendData']('trade', data, false, false);

			}

		});

		

		$(document).delegate('#tradeUser .myProposition #myPropositionTrade li', 'click', function(e){

			var name = $(this).attr('id');

				

			var data = 'removeItems,' + name;

			app['sendData']('trade', data, false, false);

		});

	},

	

		bindTransaction: function () {	

		$(document).delegate('#trocar-item #aceitar', 'click', function(){
			if(user.payement == true)

			{

				$('#transaction .transaction .transaction_code').hide();

				$('#transaction .transaction .transaction_choice').hide();

				$('#transaction .transaction .transaction_moyen').show();

			}

			else

			{

				var data = 'accepter,default';

				app['sendData']('transaction', data, false, false);

				$('#trocar-item').hide();

			}

		});

		

		$(document).delegate('trocar-item #recusar', 'click', function(){
			var data = 'refuser';

			app['sendData']('transaction', data, false, false);

			$('#trocar-item').hide();

		});

		

		      

		$(document).delegate('#fechar-trocas', 'click', function(){
			var data = 'refuser';

			app['sendData']('transaction', data, false, false);

			$('#trocar-item').hide();

        });

		

		$(document).delegate('.transaction .transaction_moyen #moyen_cb', 'click', function(){

			if(user.payement == true)

			{

				var data = 'checkIfGetCB';

				app['sendData']('transaction', data, false, false);

			}

			else

			{

				var data = 'accepter,default';

				app['sendData']('transaction', data, false, false);

				$('#transaction').hide();

			}

		});

		
		$(document).delegate('.transaction .transaction_moyen #moyen_credits', 'click', function(){


			var data = 'accepter,default';

			app['sendData']('transaction', data, false, false);

			$('#trocar-item').hide();

		});

		

		$(".transaction .code input").keyup(function () {

			if($("#transaction_code1").val() != "" && $("#transaction_code2").val() != "" && $("#transaction_code3").val() != "" && $("#transaction_code4").val() != "")

			{

				var pin = $("#transaction_code1").val() + $("#transaction_code2").val() + $("#transaction_code3").val() + $("#transaction_code4").val();

				var data = 'checkCode,' + pin;

				app['sendData']('transaction', data, false, false);

			}

			else

			{

				if (this.value.length == this.maxLength) {

					$(this).next('input').focus();

				}

			}

		});

	}, 

	
					

	

		effectover: function () {

        $(document).delegate('.vmais', 'click', function() {
			 function tcargos()

		                          {

			                         $(".tgang-members.cargo1").empty();

			                         $(".tgang-members.cargo2").empty();

			                         $(".tgang-members.cargo3").empty();

			                         $(".tgang-members.cargo4").empty();

		 	                         $(".tgang-members.cargo5").empty();

		                           }

			         var data = $(this).attr('id');

                                tcargos();

				app['sendData']('targetgangue', data, false, false);

			

		});

	    $(document).delegate('#sair-gangue', 'click', function(){

        $('#sair-gg').show();

        });


	    $(document).delegate('#jukebox-tv-toggle', 'click', function(){

        $("#jukebox-player-wrapper").toggle();

        });

        
        $(document).delegate('#recusar_gg', 'click', function(){
        $('#sair-gg').hide();
		});
		
     	$(document).delegate('#confirmar_gg', 'click', function(){
                $('#inicio-gangue').hide();
                caixagangue = false;
                $('#sair-gg').hide();
                $('#gang-colours-window').hide();
                $('#gang2').hide();
                $('#gangrival').hide();
			    var data = "sair";
			    app['sendData']('gang', data, false, false);
		});

		$(document).delegate('#bprocurados', 'click', function(){
            if($('#wanted').is(":visible"))
			{
				$("#wanted").hide();
			    app['sendData']('procurados', 'atualizar', false, false);
			}
			else
			{
				$("#wanted").show();
			    app['sendData']('procurados', 'atualizar', false, false);
			}
		});
	
		$(document).delegate('#Inventario', 'click', function(){
            if($('#inventario').is(":visible"))
			{
				$("#inventario").hide();
			}
			else
			{
				$("#inventario").show();
			}
		});
		
		$(document).delegate('#entraremprego', 'click', function(){
			var empregonome = $("#jobname").text();
			$("#empregoconvite").text(empregonome);
			$("#recebeuconvite").show();
			$("#convitenenhum").hide();

		});
		$(document).delegate('#aceitaremprego', 'click', function(){

			$("#recebeuconvite").hide();
			$("#convitenenhum").show();
            $(".container-mEmpregos").hide();
            
			var corpid = $("#jobid").text();
			var data = 'corp,' + corpid;
			app['sendData']('emprego', data, false, false);

		});
		$(document).delegate('#recusaremprego', 'click', function(){

			$("#recebeuconvite").hide();
			$("#convitenenhum").show();

		});
		
		$(document).delegate('.botaosave', 'click', function(){

			var classe = $("#classezinha").val();
			var sexo = $(".sexonome").val();
            var pais = $("#suacity").val();
            
			var save = 'aprovar,' + classe + "," + sexo + "," + pais;

			app['sendData']('verificar', save, false, false);

		});
		$(document).delegate('.emoji', 'click', function(){

			var emoji = $(this).attr('emojiname');
			var ir = 'emoji,' + emoji;

			app['sendData']('item', ir, false, false);

		});
		$(document).delegate('#botao-taxi', 'click', function(){
			var idtaxi = $(this).attr('idtaxi');
			var ir = ':taxi ' + idtaxi;
			app['sendData']('conversar', ir, false, false);

		});



			$(".configurations").click(function () {

			if($('#configs').is(":visible"))

			{

				$("#configs").hide();

			}

			else

			{

				$("#configs").show();

			}

		});
        $(document).delegate('.mapWrapper-resgate', 'click', function(){
			if($('.container-resgate').is(":visible"))
			{
				$(".container-resgate").hide();	
				$('.receber-resgate').empty();			
			}
			else
			{
				$(".container-resgate").show();
			}
		});
		$(document).delegate('#musicabotton', 'click', function(){
			if(radio == true)
			{
             $(".mapWrapper-radioHyce").css("width", "80px");
			   radio = false;
			}
			else
			{
			   radio = true;
             $(".mapWrapper-radioHyce").css("width", "245px");
			}
		});
     	$(document).delegate('.emojibotao', 'click', function(){
			if($('.emojiBox').is(":visible"))
			{
				$(".emojiBox").hide();
			}
			else
			{
				$(".emojiBox").show();
			}
		});

     	$(document).delegate('#bmacro', 'click', function(){
			if($('#settings').is(":visible"))
			{
				$("#settings").hide();
                configs = false;
				$("#settings .body .settings-category-options .macros").empty();
			}
			else
			{
				$("#settings").show();
                configs = true;
				app['sendData']('macros', 'st', false, false);
			}
		});

		$(document).delegate('.itemsbuy', 'click', function(){

		                	var balas =  $("#balasval").val();
                       		var data = $(this).attr('arma') + "," + balas;
		                   	app['sendData']('evento_c', data, false, false);

            

        });
		$(document).delegate('.macro-delete-button', 'click', function(){

             var li = $(this).attr('id');

			 var vl = 'rv,' + li;

			 app['sendData']('macros', vl, false, false);

			 $(this).parents('.macro').remove();

            

        });

		$(document).delegate('#fechar-cor', 'click', function(){

			$('#gang-colours-window').hide();

        });

		$(document).delegate('#fechar', 'click', function(){

			$('.corpo-proc').hide();

        });                

           function lcargos()

		                          {

			                         $(".gang-members.cargo1").empty();

			                         $(".gang-members.cargo2").empty();

			                         $(".gang-members.cargo3").empty();

			                         $(".gang-members.cargo4").empty();

		 	                         $(".gang-members.cargo5").empty();

		                           }

        		

        $(document).delegate('#inicio-gangue .fechar-gangue', 'click', function(){

                caixagangue = false;
                $("#inicio-gangue").hide();



	    lcargos();

        });

        $(document).delegate('#target-gangue .fechar-tgangue', 'click', function(){

                $("#target-gangue").hide();

        });

        $(document).delegate('#gang-colours-change-button', 'click', function(){

                var x = $('#gang-colours-primary').css('backgroundColor');

                hexc(x);

                var color1 = gcolor;

                var y = $('#gang-colours-secondary').css('backgroundColor');

                hexc(y);

                var color2 = gcolor;

		var cores =  color1 + "," + color2;

		app['sendData']('gcor', cores, false, false);

                $('#gangcolor1').css("background", color1);

                $('#gangcolor2').css("background", color2);

                $('#gang-colours-window').hide();

        });

	    function hexc(colorval) {

            var parts = colorval.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

            delete(parts[0]);

            for (var i = 1; i <= 3; ++i) {

                parts[i] = parseInt(parts[i]).toString(16);

                if (parts[i].length == 1) parts[i] = '0' + parts[i];

            }

            gcolor = '#' + parts.join('');

        }

        $(document).delegate('.gcor', 'click', function(){

				var div = $(this).attr('id');

                var x = $('#' + div + '').css('backgroundColor');

                hexc(x);

                $('#gang-colours-primary').css("background", gcolor);

        });

        $(document).delegate('.gcor2', 'click', function(){

				var div = $(this).attr('id');

                var x = $('#' + div + '').css('backgroundColor');

                hexc(x);

                $('#gang-colours-secondary').css("background", gcolor); 

        });

		$(document).delegate('#change-gang-colours-button', 'click', function() {

			$("#gang-colours-window").show();

        });

        $(document).delegate('#st-eu', 'click', function(){

			$("#dados-gangue-eu").show();

			$("#dados-gangue").hide();

        });	

	$(document).delegate('.remove-member', 'click', function(e) {

			var remover = "expulsar," + $(this).attr('remover');

			$(this).hide();

			app['sendData']('gang', remover, false, false);

			lcargos();

        });

        $(document).delegate('.promote-member', 'click', function(e) {

			var promover = "promover," + $(this).attr('promover');

			$(this).hide();

			app['sendData']('gang', promover, false, false);

			lcargos();

        });

        $(document).delegate('.demote-member', 'click', function() {

			var rebaixar = "rebaixar," + $(this).attr('rebaixar');

	                lcargos();

			$(this).hide();

			app['sendData']('gang', rebaixar, false, false);

        });

        $(document).delegate('#convidar-botao', 'click', function() {

                var gangname = "convidar," + $("#nome-convidado-g").val();

	        app['sendData']('gang', gangname, false, false);

                $('#invite_text').hide();

        });

		$(document).delegate('#st-gg', 'click', function(){

			$("#dados-gangue-eu").hide();

			$("#dados-gangue").show();

        });	
        

        $(document).delegate('#participar', 'click', function(event){
           var data = "join"
		   app['sendData']('evento', data, false, false);

		});                           	
		$(document).delegate('#eslot1', 'click', function(event){
           var data = 'desequipar,' + sloteq1;
		   app['sendData']('item', data, false, false);
		});
                      
		$(document).delegate('#eslot2', 'click', function(e){
			var data = 'desequipar,' + sloteq2;
			              	app['sendData']('item', data, false, false);
	   	}); 
		$(document).delegate('#slot1', 'click', function(e){
		    var data = 'equipar,' + wslot1 + ',1';
            app['sendData']('item', data, false, false);
	    }); 		
		$(document).delegate('#slot2', 'click', function(e){
		    var data = 'equipar,' + wslot2 + ',2';
            app['sendData']('item', data, false, false);
	    }); 
		$(document).delegate('#slot3', 'click', function(e){
		    var data = 'equipar,' + wslot3 + ',3';
            app['sendData']('item', data, false, false);
	    }); 
		$(document).delegate('#slot4', 'click', function(e){
		    var data = 'equipar,' + wslot4 + ',4';
            app['sendData']('item', data, false, false);
	    });
		$(document).delegate('#slot5', 'click', function(e){
		    var data = 'equipar,' + wslot5 + ',5';
            app['sendData']('item', data, false, false);
	    });
		$(document).delegate('#slot6', 'click', function(e){
		    var data = 'equipar,' + wslot6 + ',6';
            app['sendData']('item', data, false, false);
	    });
		$(document).delegate('#slot7', 'click', function(e){
		    var data = 'equipar,' + wslot7 + ',7';
            app['sendData']('item', data, false, false);
	    });
		$(document).delegate('#slot8', 'click', function(e){
		    var data = 'equipar,' + wslot8 + ',8';
            app['sendData']('item', data, false, false);
	    });
		$(document).delegate('#slot9', 'click', function(e){
		    var data = 'equipar,' + wslot9 + ',9';
            app['sendData']('item', data, false, false);
	    });		
		$(document).delegate('#slot10', 'click', function(e){
		    var data = 'equipar,' + wslot10 + ',10';
            app['sendData']('item', data, false, false);
	    });		
		$(document).delegate('#slot11', 'click', function(e){
		    var data = 'equipar,' + wslot11 + ',11';
            app['sendData']('item', data, false, false);
	    });		
		$(document).delegate('#slot12', 'click', function(e){
		    var data = 'equipar,' + wslot12 + ',12';
            app['sendData']('item', data, false, false);
	    });
		$(document).delegate('#aceitar_offer', 'click', function(e){
			var data = "aceitar";
			$('#hl-offer').hide();
			app['sendData']('oferta', data, false, false);
		});
		$(document).delegate('#recusar_offer', 'click', function(e){
			$('#hl-offer').hide();
			var data = "recusar";
			app['sendData']('oferta', data, false, false);
		    
		});
		$(document).delegate('#perfil2', 'click', function(e){
			if($('.container-perfil').is(":visible"))

			{

				$(".container-perfil").hide();

			}

			else

			{

			$(".container-perfil").show();
		    $("#level-stat").attr("class", "nome-tabela selecionada");
            $("#pessoal-stat").attr("class", "nome-tabela");
            $("#trab-stat").attr("class", "nome-tabela");
            $("#gang-stat").attr("class", "nome-tabela");
            $("#stats-stat").attr("class", "nome-tabela");
            $("#estatistica-skill").show();
            $("#infos-pessoais").hide();
            $("#infos-trabalho").hide();
            $("#infos-gangue").hide();
            $("#info-numeros").hide();
			var	data = UserID;
            app['sendData']('perfil', data, false, false);

		
            }
	       });
		$(document).delegate('.titulo-apptmn .close', 'click', function(){
            $('.apptmn-ver').hide();
        });
        $(document).delegate('.titulo-apptmn .close', 'mouseover', function(){
            $(this).css('content', 'url(/statics/img/fecharx.png)');
        });        
        $(document).delegate('.titulo-apptmn .close', 'mouseleave', function(){
            $(this).css('content', 'url(/statics/img/fechar.png)');
        }); 
       	$(document).delegate('.container-aptlist', 'mouseenter', function(){
		    $(this).draggable();
        });	
		$(document).delegate('.container-resgate', 'mouseenter', function(){
		    $(this).draggable();
        });	
        $(document).delegate('.container-apptmn', 'mouseenter', function(){
		    $(this).draggable();
        });	
	    $(document).delegate('.container-menusComida', 'mouseenter', function(){
		    $(this).draggable();
        });	 	
		$(document).delegate('.container-mEmpregos', 'mouseenter', function(){
		    $(this).draggable();
        });	 
        $(document).delegate('.containerBox', 'mouseenter', function(){
		    $(this).draggable();
        });	 
		$(document).delegate('.container-comandos', 'mouseenter', function(){
		    $(this).draggable();
        });	 
		$(document).delegate('#configs', 'mouseenter', function(){
		    $(this).draggable();
        });	  
		$(document).delegate('#settings', 'mouseenter', function(){
		    $(this).draggable();
        });	 
		$(document).delegate('.container', 'mouseenter', function(){
		    $(this).draggable();
        });	 
		$(document).delegate('#AtmMachine', 'mouseenter', function(){
		    $(this).draggable();
        });	
		$(document).delegate('.identidade-hyce-ver', 'mouseenter', function(){
		    $(this).draggable();
        });	 
        $(document).delegate('.corpo-proc', 'mouseenter', function(){
		    $(this).draggable();
        });	 

		$(document).delegate('#inventario', 'mouseenter', function(){
		    $(this).draggable();
        });
        $(document).delegate('.container-loja', 'mouseenter', function(){
		    $(this).draggable();
        });       
        $(document).delegate('.container-zoombie', 'mouseenter', function(){
		    $(this).draggable();
        });
		$(document).delegate('#corpo-cidade', 'mouseenter', function(){
		    $(this).draggable();
        });    
		$(document).delegate('.container-perfil', 'mouseenter', function(){
		    $(this).draggable();
        });    

        $(document).delegate('#ed-bio', 'click', function() {

            $(this).hide();

            bioeditar = true;
            $("#digitar-bio").show();

            $("#frase-bio").hide();

            $("#sv-bio").show();

            $("#cl-bio").show();

        });  

        $(document).delegate('.lapis-gg', 'click', function() {

			var cargo = $(this).attr('cargo');

			$("#input-rank" + cargo + "").show();

			$(this).hide();

			$("#rank" + cargo + "").hide();

			$("#cg" + cargo + "").hide();

			$("#sv" + cargo + "").show();

			$("#cl" + cargo + "").show();

			return false;

        });

        $(document).delegate('.salvar-gg', 'click', function(e) {

			var cargo = $(this).attr('cargo');

			var nome = $("#input-rank" + cargo + "").val();

			$("#input-rank" + cargo + "").hide();

			$(this).hide();

			$("#rank" + cargo + "").show();

			$("#rank" + cargo + "").text(nome);

			$("#csg" + cargo + "").show();

			$("#sv" + cargo + "").hide();

			$("#cl" + cargo + "").hide();

		        var gangnome = cargo + "," + nome;

		        app['sendData']('gcargo', gangnome, false, false);

			return false;

        });

        $(document).delegate('.cancelar-gg', 'click', function(e) {

			var cargo = $(this).attr('cargo');

			var nome = $("#input-rank" + cargo + "").val();

			$("#input-rank" + cargo + "").hide();

			$(this).hide();

			$("#rank" + cargo + "").show();

			$("#cg" + cargo + "").show();

			$("#sv" + cargo + "").hide();

			$("#cl" + cargo + "").hide();

			return false;

        });

		

	   $(document).delegate('#criar-gangue', 'click', function(){

		    if (botton == false) {

                botton = true;

				$("#criar-gangue-t").text("Criando gangue...");

				$("#nome-gangue-c").show();

			} else if (botton == true) {

                botton = false;

				var gangnome = "criar," + $("#nome-gangue-c").val();

				app['sendData']('gang', gangnome, false, false);

				}

            

        });	
     $(document).delegate('#menu-comida', 'click', function() {
		    var dado = $(this).attr("comida");
		    var infos = 'detalhes,' + dado;
			app['sendData']('infos', infos, false, false);
        });
     $(document).delegate('#solicitarcomida', 'click', function() {
		    var dado = $(this).attr("comida");
			app['sendData']('pedir', dado, false, false);
        });
     $(document).delegate('#corp-data', 'click', function() {
             var corp = $(this).attr("emprego");
			$('#empregossdados').load("/infoemprego/" + corp);
            $('#empregossdados').show();
            $('#empregossinfo').hide();

        });

     $(document).delegate('.jury-vote-button', 'click', function() {

		    	var voto = $(this).attr("data-vote");

				app['sendData']('julgamento', voto, false, false);

        });

     $(document).delegate('#chatmode', 'click', function() {

		    	app['sendData']('gmodo', '', false, false);

        });
        
     $(document).delegate('#capturar', 'click', function() {

		 app['sendData']('capturar', 'gangue', false, false);

        });
        
     $(document).delegate('.hotelAlertWrapper-1MZsz_0', 'click', function() {
              $(".hotelAlertWrapper-1MZsz_0").hide();  

			  $(".message-DvzST_0").html();

        });

     $(document).delegate('#sv-bio', 'click', function() {

                var frase = $("#digitar-bio").val();
                bioeditar = false;
                $('#digitar-bio').val('');

		    	app['sendData']('change', frase, false, false);

        });
     
     $(document).delegate('#cl-bio', 'click', function() {

                $('#frase-bio').show();

                $('#ed-bio').show();

                $('#digitar-bio').hide();
                bioeditar = false;
                $("#sv-bio").hide();

                $("#cl-bio").hide();

        });


        $('#digitar-bio').keypress(function(e) {

            if (e.which == 13) {

                e.preventDefault();

            }

        });

    	$(function() {

            $("#comandosbusca").keyup(function() {

                var texto = $(this).val();



                $(".faq").css("display", "block");

                $(".faq").each(function() {

                    if ($(this).text().indexOf(texto) < 0)

                        $(this).css("display", "none");

                });

            });

        });
        $(document).delegate('#rr1', 'click', function(e) {

			var arma = "reload," + $(this).attr('arma');
			app['sendData']('item', arma, false, false);

        });
        $(document).delegate('#rr2', 'click', function(e) {

			var arma = "reload," + $(this).attr('arma');
			app['sendData']('item', arma, false, false);

        });
        $(document).delegate('#rr3', 'click', function(e) {

			var arma = "reload," + $(this).attr('arma');
			app['sendData']('item', arma, false, false);

        });
        $(document).delegate('#rr4', 'click', function(e) {

			var arma = "reload," + $(this).attr('arma');
			app['sendData']('item', arma, false, false);

        });
        $(document).delegate('#rr5', 'click', function(e) {

			var arma = "reload," + $(this).attr('arma');
			app['sendData']('item', arma, false, false);

        });
        $(document).delegate('#rr6', 'click', function(e) {

			var arma = "reload," + $(this).attr('arma');
			app['sendData']('item', arma, false, false);

        });
        $(document).delegate('#rr7', 'click', function() {

			var arma = "reload," + $(this).attr('arma');
			app['sendData']('item', arma, false, false);

        });
        $(document).delegate('#rr8', 'click', function() {

			var arma = "reload," + $(this).attr('arma');
			app['sendData']('item', arma, false, false);

        });
        $(document).delegate('#rr9', 'click', function() {

			var arma = "reload," + $(this).attr('arma');
			app['sendData']('item', arma, false, false);

        });
        $(document).delegate('#rr10', 'click', function() {

			var arma = "reload," + $(this).attr('arma');
			app['sendData']('item', arma, false, false);

        });
        $(document).delegate('#rr11', 'click', function() {

			var arma = "reload," + $(this).attr('arma');
			app['sendData']('item', arma, false, false);

        });
        $(document).delegate('#rr12', 'click', function() {

			var arma = "reload," + $(this).attr('arma');
			app['sendData']('item', arma, false, false);

        });
		$(function() {

            $("#procurar-quarto").keyup(function() {

                var texto = $(this).val();



                $(".corpo-quartos").css("display", "block");

                $(".corpo-quartos").each(function() {

                    if ($(this).text().indexOf(texto) < 0)

                        $(this).css("display", "none");

                });

            });

        });
        
        $(document).delegate('.seta-baixinho', 'click', function() {
            setinhabaixo = true;
            $(".seta-cima").show();
             $(".seta-baixinho").hide();
             $(".barra-falar").hide();
        });
        
        $(document).delegate('.seta-cima', 'click', function() {
            setinhabaixo = false;
            $(".seta-cima").hide();
             $(".seta-baixinho").show();
             $(".barra-falar").show();
        });
        $(document).delegate('#bbalas', 'click', function() {
            $("#bbalas").attr("class", "v-cmd lei-selecionada");

            $("#armasloja").attr("class", "v-cmd");

            $("#coletes").attr("class", "v-cmd");
            
            $(".items-loja").empty();
            $('.items-loja').append('<dts class="lojaite" id="balasarma"> <div class="imagesitems"> <img class="imgs" src="/statics/img/item/bala.png" style="position: absolute;margin-left: -59px;margin-top: 20px;"> <b class="titulo-items-name" style="margin-left: 29px;margin-top: 20px;">Balas</b> <br> <b class="dano-items-name"><input type="text" id="balasval" placeholder="Quantidade..." maxlength="3" size="1" style="margin-left: 63px;width: 90px;margin-top: -10px;" class="text-box"></b>  <br> <b class="custo-items-name"></b> <div class="buyitem"> <img class="itemsbuy" arma="balas" src="https://i.imgur.com/1H8ZEDt.png" style="margin-top: -15px;"></div></div> </dts>');	

        });
        $(document).delegate('#armasloja', 'click', function() {

            $("#armasloja").attr("class", "v-cmd lei-selecionada");

            $("#bbalas").attr("class", "v-cmd");

            $("#coletes").attr("class", "v-cmd");
            
            $(".items-loja").show();
            
            $(".items-loja").empty();
			var data = 'armas';
			app['sendData']('item', data, false, false);
            
            
               });
        $(document).delegate('#civil', 'click', function() {
            $("#civil").attr("class", "v-cmd lei-selecionada");

            $("#trabalho").attr("class", "v-cmd");

            $("#crime").attr("class", "v-cmd");

            $("#vip").attr("class", "v-cmd");

            $("#eqp").attr("class", "v-cmd");

            $("#receber-comandos").empty();

            $("#receber-comandos").load("/civil");

        });

        $(document).delegate('#trabalho', 'click', function() {
            $("#civil").attr("class", "v-cmd");

            $("#trabalho").attr("class", "v-cmd lei-selecionada");

            $("#crime").attr("class", "v-cmd");

            $("#vip").attr("class", "v-cmd");

            $("#eqp").attr("class", "v-cmd");

            $("#receber-comandos").empty();

            $("#receber-comandos").load("/trabalho");

        });

        $(document).delegate('#crime', 'click', function() {

            $("#civil").attr("class", "v-cmd");

            $("#trabalho").attr("class", "v-cmd");

            $("#crime").attr("class", "v-cmd lei-selecionada");

            $("#vip").attr("class", "v-cmd");

            $("#eqp").attr("class", "v-cmd");



            $("#receber-comandos").empty();

            $("#receber-comandos").load("/crimes");

        });

        $(document).delegate('#vip', 'click', function() {

            $("#civil").attr("class", "v-cmd");

            $("#trabalho").attr("class", "v-cmd");

            $("#crime").attr("class", "v-cmd");

            $("#vip").attr("class", "v-cmd lei-selecionada");

            $("#eqp").attr("class", "v-cmd");



            $("#receber-comandos").empty();

            $("#receber-comandos").load("/vip");

        });

        $(document).delegate('#eqp', 'click', function() {

            $("#civil").attr("class", "v-cmd");

            $("#trabalho").attr("class", "v-cmd");

            $("#crime").attr("class", "v-cmd");

            $("#vip").attr("class", "v-cmd");

            $("#eqp").attr("class", "v-cmd lei-selecionada");



            $("#receber-comandos").empty();

            $("#receber-comandos").load("/cequipe");

        });

        $(document).delegate('#level-stat', 'click', function() {

            $("#level-stat").attr("class", "nome-tabela selecionada");

            $("#pessoal-stat").attr("class", "nome-tabela");

            $("#trab-stat").attr("class", "nome-tabela");

            $("#gang-stat").attr("class", "nome-tabela");

            $("#stats-stat").attr("class", "nome-tabela");



            $("#estatistica-skill").show();

            $("#infos-pessoais").hide();

            $("#infos-trabalho").hide();

            $("#infos-gangue").hide();

            $("#info-numeros").hide();

        });

        $(document).delegate('#pessoal-stat', 'click', function() {

            $("#level-stat").attr("class", "nome-tabela");

            $("#pessoal-stat").attr("class", "nome-tabela selecionada");

            $("#trab-stat").attr("class", "nome-tabela");

            $("#gang-stat").attr("class", "nome-tabela");

            $("#stats-stat").attr("class", "nome-tabela");



            $("#estatistica-skill").hide();

            $("#infos-pessoais").show();

            $("#infos-trabalho").hide();

            $("#infos-gangue").hide();

            $("#info-numeros").hide();

        });

        $(document).delegate('#trab-stat', 'click', function() {

            $("#level-stat").attr("class", "nome-tabela");

            $("#pessoal-stat").attr("class", "nome-tabela");

            $("#trab-stat").attr("class", "nome-tabela selecionada");

            $("#gang-stat").attr("class", "nome-tabela");

            $("#stats-stat").attr("class", "nome-tabela");



            $("#estatistica-skill").hide();

            $("#infos-pessoais").hide();

            $("#infos-trabalho").show();

            $("#infos-gangue").hide();

            $("#info-numeros").hide();

        });

        $(document).delegate('#gang-stat', 'click', function() {

            $("#level-stat").attr("class", "nome-tabela");

            $("#pessoal-stat").attr("class", "nome-tabela");

            $("#trab-stat").attr("class", "nome-tabela");

            $("#gang-stat").attr("class", "nome-tabela selecionada");

            $("#stats-stat").attr("class", "nome-tabela");



            $("#estatistica-skill").hide();

            $("#infos-pessoais").hide();

            $("#infos-trabalho").hide();

            $("#infos-gangue").show();

            $("#info-numeros").hide();

        });

        $(document).delegate('#foco', 'click', function() {

                if (foco == false) {

                    $('.tlock').css('content', 'url(/statics/img/targets/lockclosed.png)');

                    foco = true


					

                } else if (foco == true) {

                    $('.tlock').css('content', 'url(/statics/img/targets/lockopen.png)');

                    foco = false;

                     var	target = UserID;
                     app['sendData']('tg', target, false, false);
                }

        });
        $(document).delegate('#stats-stat', 'click', function() {

            $("#level-stat").attr("class", "nome-tabela");

            $("#pessoal-stat").attr("class", "nome-tabela");

            $("#trab-stat").attr("class", "nome-tabela");

            $("#gang-stat").attr("class", "nome-tabela");

            $("#stats-stat").attr("class", "nome-tabela selecionada");



            $("#estatistica-skill").hide();

            $("#infos-pessoais").hide();

            $("#infos-trabalho").hide();

            $("#infos-gangue").hide();

            $("#info-numeros").show();

        });

		
		$(document).delegate('#macro-press-key', 'click', function(){
                if (addmacros == true) {
                        addkey = false;
                        rebind = false;
			$('#macro-press-key').text("Pressione a Tecla/Combo");
                } else if (addmacros == false) {
                        addmacros = true;
			$('#macro-press-key').text("Clique e pressione a Tecla");
                }
			});




           $('#barra-falar').keypress(function(event){
           var keycode = (event.keyCode ? event.keyCode : event.which);
            if(keycode == '13'){
		          var data =  $("#barra-falar").val();
                  if (chatnormal == true) {
			      app['sendData']('conversar', data, false, false);
                } 
                if (negrito == true) {
                  app['sendData']('gritar', data, false, false);
            }                
            if (sussurrar == true) {
                  app['sendData']('sussurrar', data, false, false);
            }
                  $('#barra-falar').val(''); 

              }
             });

			$(document).on('keydown', function(event) {
             if (addkey == true){return;}
             if (rebind == true){ return;}
             addkey = true;
             rebind = true;
             tecla = event.which;
	         $('#macro-press-key').text(event.key);
          });
        
		$(document).delegate('#video-add-submit', 'click', function(){
			var data =  $("#video-add-value").val();
			var texto = 'ad,' + data;
			app['sendData']('item', texto, false, false);
			$("#video-add-value").val('');
			});
		$(document).delegate('.apts-A', 'click', function(e) {
			var ir = "ir," + $(this).attr('roomid');            
			$('.aptlist-ver').hide();
			$('.box-d-apt').empty();
			$('.door-ap').show();	
			app['sendData']('apartamentos', ir, false, false);

        });
        $(document).delegate('.door-ap', 'click', function(e) {
			var ir = "ir," + $(this).attr('roomid');       
			$('.door-ap').hide();	
			app['sendData']('apartamentos', ir, false, false);

        });
		$(document).delegate('#macro-add-submit', 'click', function(){
             addmacros = false;
			var data =  $("#macro-add-value").val();
			var key =  $('#macro-press-key').text();
			tecla;
			var texto = 'ad,' + key + "," + data + "," + tecla;
			app['sendData']('macros', texto, false, false);
			});



			$(document).on('keyup', function(e) {
             teclapress = e.which;
           if (macros == true) 
            {
			app['sendData']('evento_m', e.which, false, false);
           }
   });


        $(".modechat").click(function(e) {


                if (chatnormal == true) {

                    chatnormal = false;
                   	$('.clssmode').text("Negrito");
                   	sussurrar = false;
                    negrito = true;
                }                else if (sussurrar == true) {
                   	negrito = false;
                    sussurrar = false;
                    chatnormal = true;
			$('.clssmode').text("Normal");

            }
                 
                else if (negrito == true) {
                   	negrito = false;
                    sussurrar = false;
                    chatnormal = true;
			$('.clssmode').text("Normal");

            }

        });
        
		$(document).delegate('#macro-enabled', 'click', function(){
                if (macros == true) {
                    macros = false;
			app['sendData']('evento_s', 'Macro desativado com sucesso.', false, false);
                } else if (macros == false) {
                    macros = true;
			app['sendData']('evento_s', 'Macro ativado com sucesso.', false, false);
                }
        });
       $(document).delegate('#live-feed-enabled', 'click', function(){
                if (livefeed == false) {
                    livefeed = true;
					$("#livefeed-new").empty();
					$("#livefeed-new").html('<div id="corpo-livefeed-new" class="div-ativado"><div id="fonte-livefeed">Live-feed <span id="blue">ativado</span>. As notificações estão visíveis.</div></div>');
					$(".div-ativado").fadeOut(10000);

                } else if (livefeed == true) {
                    livefeed = false;
					$("#livefeed-new").empty();
					$("#livefeed-new").html('<div id="corpo-livefeed-new" class="div-desativado"><div id="fonte-livefeed">Live-feed <span id="red">desativado</span>. As notificações estão desativadas.</div></div>');
					$(".div-desativado").fadeOut(10000);
                }
        });

       $(document).delegate('.fechar-inventario', 'click', function(){
            $('.container-inventario').hide();
        }); 
        $(document).delegate('.titulo-aptlist .close', 'click', function(){
            $('.aptlist-ver').hide();
			$('.box-d-apt').empty();	
        });
        $(document).delegate('.container-resgate .close', 'click', function(){
            $('.container-resgate').hide()
			$('.receber-resgate').empty();	
        });
       $(document).delegate('.titulo-menusComida .close', 'click', function(){
            $('.container-menusComida').hide()
        });
       $(document).delegate('.titulo-mEmpregos .close', 'click', function(){
            $('.container-mEmpregos').hide();
        });
       $(document).delegate('#gang .close', 'click', function(){
            $('#gang').hide();
        });
        $(document).delegate('.botaok', 'click', function(){
            $('.container-zoombie').hide();
        });
        $(document).delegate('#fechar-perfil', 'click', function(){
            $('.container-perfil').hide();
        });
    
        $(document).delegate('.cclose', 'click', function(){
            $('#configs').hide();
        });

        $(document).delegate('.bclose', 'click', function(){
            $('#settings').hide();
            configs = false;
        });
        $(document).delegate('.jclose', 'click', function(){
            $('#jukehyce').hide();
            caixajuke = false;
        });
        
        $(document).delegate('.oclose', 'click', function(){
            $('#hl-offer').hide();
        });

        $(document).delegate('.fclose', 'click', function(){
            $('.2').hide();
        });       

        $(document).delegate('#fecharproc', 'click', function(){
            $('#wanted').hide();
        });		
        $(document).delegate('.fechar-taxi', 'click', function(){
            $('#corpo-cidade').hide();
            taximapa = false;
        });

        $(document).delegate('#ftarget', 'click', function(){
            $('.2').hide();
        });

        $(document).delegate('.jclose', 'click', function(){
            $('#jury-voting').hide();
        });


        $(document).delegate('.tooltip', 'mouseover', function(){
             $("#tooltip").css('opacity', '1');
        });        
        $(document).delegate('.tooltip', 'mouseleave', function(){
             $("#tooltip").css('opacity', '0');
        }); 




        $(document).delegate('.mapWrapper-resgate', 'mouseover', function(){
             $(this).css('right', '-4px');
        });        
        $(document).delegate('.mapWrapper-resgate', 'mouseleave', function(){
             $(this).css('right', '-62px');
        }); 



        $(document).delegate('.bclose', 'click', function(){
            $('#settings').hide();
        });       
        $(document).delegate('.container-comandos .close', 'click', function(){
            $('.container-comandos').hide();
        });
        $(document).delegate('.titulo-mEmpregos .close', 'mouseover', function(){
            $(this).css('content', 'url(/statics/img/fecharx.png)');
        });        
        $(document).delegate('.titulo-mEmpregos .close', 'mouseleave', function(){
            $(this).css('content', 'url(/statics/img/fechar.png)');
        }); 
        $(document).delegate('#fecharproc', 'mouseover', function(){
            $(this).css('content', 'url(/statics/img/fecharx.png)');
        });        
        $(document).delegate('#fecharproc', 'mouseleave', function(){
            $(this).css('content', 'url(/statics/img/fechar.png)');
        }); 
        $(document).delegate('.fechar-tgangue', 'mouseleave', function(){
            $(this).css('content', 'url(/statics/img/fechar.png)');
        });    
        $(document).delegate('.fechar-tgangue', 'mouseover', function(){
            $(this).css('content', 'url(/statics/img/fecharx.png)');
        });

        $(document).delegate('.container-comandos .close', 'mouseleave', function(){
            $(this).css('content', 'url(/statics/img/fechar.png)');
        });
        
        $(document).delegate('.container-comandos .close', 'mouseover', function(){
            $(this).css('content', 'url(/statics/img/fecharx.png)');
        });
        $(document).delegate('.container-comandos .close', 'mouseleave', function(){
            $(this).css('content', 'url(/statics/img/fechar.png)');
        });
        
        $(document).delegate('.fechar-inventario', 'mouseover', function(){
            $(this).css('content', 'url(/statics/img/fecharx.png)');
        });
        $(document).delegate('.fechar-inventario', 'mouseleave', function(){
            $(this).css('content', 'url(/statics/img/fechar.png)');
        });
        
        $(document).delegate('.fechar-taxi', 'mouseover', function(){
            $(this).css('content', 'url(/statics/img/fecharx.png)');
        });
        $(document).delegate('.fechar-taxi', 'mouseleave', function(){
            $(this).css('content', 'url(/statics/img/fechar.png)');
        });

        $(document).delegate('#rr1', 'mouseover', function(){
            $(this).attr("class", "fa fa-sync fa-spin");
        });
        $(document).delegate('#rr1', 'mouseleave', function(){
            $(this).attr('class', "fa fa-sync");
        });
        $(document).delegate('#rr2', 'mouseover', function(){
            $(this).attr("class", "fa fa-sync fa-spin");
        });
        $(document).delegate('#rr2', 'mouseleave', function(){
            $(this).attr('class', "fa fa-sync");
        });               
        $(document).delegate('#rr3', 'mouseover', function(){
            $(this).attr("class", "fa fa-sync fa-spin");
        });
        $(document).delegate('#rr3', 'mouseleave', function(){
            $(this).attr('class', "fa fa-sync");
        });
        $(document).delegate('#rr4', 'mouseover', function(){
            $(this).attr("class", "fa fa-sync fa-spin");
        });
        $(document).delegate('#rr4', 'mouseleave', function(){
            $(this).attr('class', "fa fa-sync");
        });
        $(document).delegate('#rr5', 'mouseover', function(){
            $(this).attr("class", "fa fa-sync fa-spin");
        });
        $(document).delegate('#rr5', 'mouseleave', function(){
            $(this).attr('class', "fa fa-sync");
        });
        $(document).delegate('#rr6', 'mouseover', function(){
            $(this).attr("class", "fa fa-sync fa-spin");
        });
        $(document).delegate('#rr6', 'mouseleave', function(){
            $(this).attr('class', "fa fa-sync");
        });
        $(document).delegate('#rr7', 'mouseover', function(){
            $(this).attr("class", "fa fa-sync fa-spin");
        });
        $(document).delegate('#rr7', 'mouseleave', function(){
            $(this).attr('class', "fa fa-sync");
        });
        $(document).delegate('#rr8', 'mouseover', function(){
            $(this).attr("class", "fa fa-sync fa-spin");
        });
        $(document).delegate('#rr8', 'mouseleave', function(){
            $(this).attr('class', "fa fa-sync");
        });
        $(document).delegate('#rr9', 'mouseover', function(){
            $(this).attr("class", "fa fa-sync fa-spin");
        });
        $(document).delegate('#rr9', 'mouseleave', function(){
            $(this).attr('class', "fa fa-sync");
        }); 
        $(document).delegate('#rr10', 'mouseover', function(){
            $(this).attr("class", "fa fa-sync fa-spin");
        });
        $(document).delegate('#rr10', 'mouseleave', function(){
            $(this).attr('class', "fa fa-sync");
        });
        
        
barra.addEventListener("blur", function( event ) {
	
    if (configs == true){ return;}
    if (atm == true){ return;}
    if (captcha == true){ return;}
    if (caixaligar == true){ return;}
    if (caixasms == true){ return;}
    if (empregos == true){ return;}
    if (setinhabaixo == true){ return;}
    if (bioeditar == true){ return;}
    if (caixagangue == true){ return;}
    if (caixajuke == true){ return;}
    if (taximapa == true){ return;}
    if (trocando == true){ return;}
    $('#barra-falar').focus();
}, true);
        
        $(document).delegate('#barra-falar', 'mouseover', function(){
			$('#barra-falar').focus();
        });
        $(document).delegate('#barra-falar', 'mouseleave', function(){
			$('#barra-falar').focus();
        });
        
        $(document).delegate('#empregosbusca', 'mouseover', function(){
			$('#empregosbusca').focus();
			empregos = true;
        });



        $(document).delegate('.fclose', 'mouseover', function(){
            $(this).css('content', 'url(/statics/img/fecharx.png)');
        });
        $(document).delegate('.fclose', 'mouseleave', function(){
            $(this).css('content', 'url(/statics/img/fechar.png)');
        });

        $(document).delegate('#gang .close', 'mouseover', function(){
            $(this).css('content', 'url(/statics/img/fecharx.png)');
        });
        $(document).delegate('#gang .close', 'mouseleave', function(){
            $(this).css('content', 'url(/statics/img/fechar.png)');
        });

        $(document).delegate('.jclose', 'mouseover', function(){
            $(this).css('content', 'url(/statics/img/fecharx.png)');
        });
        $(document).delegate('.jclose', 'mouseleave', function(){
            $(this).css('content', 'url(/statics/img/fechar.png)');
        });
        
        $(document).delegate('.cclose', 'mouseover', function(){
            $(this).css('content', 'url(/statics/img/fecharx.png)');
        });
        $(document).delegate('.cclose', 'mouseleave', function(){
            $(this).css('content', 'url(/statics/img/fechar.png)');
        });

        $(document).delegate('.oclose', 'mouseover', function(){
            $(this).css('content', 'url(/statics/img/fecharx.png)');
        });
        $(document).delegate('.oclose', 'mouseleave', function(){
            $(this).css('content', 'url(/statics/img/fechar.png)');
        });
        $(document).delegate('.bclose', 'mouseover', function(){
            $(this).css('content', 'url(/statics/img/fecharx.png)');
        });
        $(document).delegate('.bclose', 'mouseleave', function(){
            $(this).css('content', 'url(/statics/img/fechar.png)');
        });


		},

	

		bindItem: function () {

		$(document).delegate('.list .item', 'click', function(e){

			if($(this).is("#coca"))

			{

				var data = 'boire,coca';

				app['sendData']('item', data, false, false);

			}

			else if($(this).is("#fanta"))

			{

				var data = 'boire,fanta';

				app['sendData']('item', data, false, false);

			}

			else if($(this).is("#called-for-jury"))

			{

				var data = 'taxi,julgamento';

				app['sendData']('item', data, false, false);

			}

			else if($(this).is("#doliprane"))

			{

				var data = 'medicament,doliprane';

				app['sendData']('item', data, false, false);

			}

			else if($(this).is("#cigarette"))

			{

				var data = 'fumer,cigarette';

				app['sendData']('item', data, false, false);

			}

			else if($(this).is("#weed"))

			{

				var data = 'fumer,weed';

				app['sendData']('item', data, false, false);

			}

			else if($(this).is("#pain"))

			{

				var data = 'manger,pain';

				app['sendData']('item', data, false, false);

			}

			else if($(this).is("#sucette"))

			{

				var data = 'manger,sucette';

				app['sendData']('item', data, false, false);

			}

			else if($(this).is("#audia8"))

			{

				var data = 'conduire,audia8';

				app['sendData']('item', data, false, false);

			}

			

			else if($(this).is("#skate"))

			{

				var data = 'carro,vip';

				app['sendData']('item', data, false, false);

			}

					

			else if($(this).is("#audia3"))

			{

				var data = 'conduire,audia3';

				app['sendData']('item', data, false, false);

			}

			else if($(this).is("#whiteHoverboard"))

			{

				var data = 'conduire,whiteHoverboard';

				app['sendData']('item', data, false, false);

			}

			else if($(this).is("#porsche911"))

			{

				var data = 'conduire,porsche911';

				app['sendData']('item', data, false, false);

			}

			else if($(this).is("#fiatpunto"))

			{

				var data = 'conduire,fiatpunto';

				app['sendData']('item', data, false, false);

			}

			else if($(this).is("#volkswagenjetta"))

			{

				var data = 'conduire,volkswagenjetta';

				app['sendData']('item', data, false, false);

			}

			else if($(this).is("#bmwi8"))

			{

				var data = 'conduire,bmwi8';

				app['sendData']('item', data, false, false);

			}

			else if($(this).is("#blackHoverboard"))

			{

				var data = 'conduire,blackHoverboard';

				app['sendData']('item', data, false, false);

			}

			else if($(this).is("#pinkHoverboard"))

			{

				var data = 'conduire,pinkHoverboard';

				app['sendData']('item', data, false, false);

			}

			else if($(this).is("#police"))

			{

				var data = 'conduire,police';

				app['sendData']('item', data, false, false);

			}

			else if($(this).is("#gouvernement"))

			{

				var data = 'conduire,gouvernement';

				app['sendData']('item', data, false, false);

			}

			else if($(this).is("#batte"))

			{

				var data = 'equipar,batte';

				app['sendData']('item', data, false, false);

			}

			else if($(this).is("#sabre"))

			{

				var data = 'equipar,sabre';

				app['sendData']('item', data, false, false);

			}

			else if($(this).is("#uzi"))

			{

				var data = 'equipar,uzi';

				app['sendData']('item', data, false, false);

			}

			else if($(this).is("#ak47"))

			{

				var data = 'equipar,ak47';

				app['sendData']('item', data, false, false);

			}

			else if($(this).is("#sabre"))

			{

				var data = 'equipar,sabre';

				app['sendData']('item', data, false, false);

			}

			else if($(this).is("#cocktail"))

			{

				var data = 'eq,cocktail';

				app['sendData']('item', data, false, false);

			}

			else if($(this).is("#taser"))

			{

				var data = 'equipar,taser';

				app['sendData']('item', data, false, false);

			}

		});

	},

		

	bindATM: function () {

				

		$(document).delegate('#AtmCloseBtn', 'click', function(){

			$('#ActivityOverlay').hide();

			$('#AtmMachine').hide();
            atm = false;

		});



		$(document).delegate('.deposit', 'click', function(){

			$('.AtmHomeScreen').hide(function(){

				$('.AtmDepositScreen').show();

			});

		});

	

		$(document).delegate('.withdraw_submit', 'click', function(){

			$('.AtmHomeScreen').hide(function(){

				$('.AtmWithdrawScreen').show();

			});

		});

		

		$(document).delegate('.atmback', 'click', function(){

			$('.AtmWithdrawScreen, .AtmDepositScreen').hide(function(){

				$('.AtmHomeScreen').show();

			});

		});	

		

		$(document).delegate('.deposit_submit', 'click', function(){

			var depositAmount = parseInt($('input[class=deposit_amount]').val());

			var account_type = $('select[class=deposit_acc]').val();			

			var data = 'deposit,' + depositAmount + "," + account_type;

			

			app['sendData']('event_atm', data, false, false);

			

		});

		

		$(document).delegate('.withdraw_submit', 'click', function(){

			var withdrawAmount = parseInt($('input[class=withdraw_amount]').val());

			var account_type = $('select[class=withdraw_acc]').val();

			var data = 'withdraw,' + withdrawAmount + "," + account_type;

			

			app['sendData']('event_atm', data, false, false);

			

		});

	

	},

	

	bindCaptchaBox: function () {	

		

	function composeCaptchaError(error){

		$('.captcha-box-status').html(error).slideDown(500);

		

		$('.captcha-box-input').animate({borderColor:'#fb6d6d !important',},1000);

		$('#captcha-box').animate({borderColor:'#fb6d6d !important',},1000);

		$('#box-notif').animate({borderColor:'#fb6d6d !important',},1000);

	}

	

	function composeCaptchaSuccess(){

		$('.captcha-box-status').slideUp(500);

		

		$('.captcha-box-success').show(200);

		

		$('.captcha-box-input').animate({borderColor:'#87bd83 !important',},1000);

		$('#captcha-box').animate({borderColor:'#87bd83 !important',},1000);

		$('#box-notif').animate({borderColor:'#87bd83 !important',},1000);

	}

	

	function resetCaptchaBox()

	{

		setTimeout(function(){	

			$('#captcha-bsox').hide();		
            captcha = false;
			$('.captcha-box-status').slideUp();	

			$('.captcha-box-success').hide();

			$('.captcha-box-input').animate({borderColor:'#ffb91d !important',},1000);

			$('#captcha-box').animate({borderColor:'rgba(174, 174, 174, 0.4) !important',},1000);

			$('#box-notif').animate({borderColor:'rgba(174, 174, 174, 0.4) !important',},1000);

			$('.captcha-box-success').hide();	

			$('.captcha-box-input').val("");

		},2000);		

	}	

		$(document).delegate('.captcha-box-input', 'keydown', function(event){
		

			if($('.captcha-box-success').is(':visible') || !($('#captcha-box').is(':visible')) )

				return;

				

			if(app['processCaptcha'] == null)

			{

				

				app['processCaptcha']  = setInterval(function(){



					if(app['curSeconds'] < app['checkSeconds'])

					{

						app['curSeconds']++;

					}

					else

					{	

						var Title = $('.captcha-box-information').text();

						

						if( ( jQuery.trim($('.captcha-box-generatedtxt').text()).toLowerCase() != jQuery.trim($('.captcha-box-input').val()).toLowerCase() ) )

						{

							clearInterval(app['processCaptcha']);

							app['processCaptcha'] = null;

							

							app['sendData']('event_captcha', 'regenerate,' + Title, false, false);
							var figure = "/swfz/c_images/notifications/imager.php?username=" + user.name + "&headonly=1&gesture=sml?1";
							$(".captcha-box-avatar").css({background: 'url(' + figure + ')'});
							composeCaptchaError("Código incorreto, digite novamente.");

							

							app['curSeconds'] = 0;

							

					

						}

						else

						{

							

							clearInterval(app['processCaptcha']);	

							app['processCaptcha'] = null;

							

							composeCaptchaSuccess();

							app['sendData']('event_captcha', 'complete,' + Title, false, false);

							

							resetCaptchaBox();																	

							app['curSeconds'] = 0;

							

							

							return;

						}

					}

					

				},1000);

			}

			

			app['curSeconds'] = 0;

			

		});

			

	},

	

	fetchStatistics: function(){

		

		app['sendData']('event_retrieveconnectingstatistics', '', true, false);

		

	},



	loadStatistics: function(usersdata, clear){

		

		clear = typeof clear === 'undefined' ? false : clear;

		

		if(!clear)

		{

			var DataParts = usersdata.split(',');

			

			var UserID = parseInt(DataParts[0]);

			var UsersFigure = DataParts[1];

			var CurHealth = parseInt(DataParts[2]);

			var MaxHealth = parseInt(DataParts[3]);

			var CurEnergy = parseInt(DataParts[4]);

			var MaxEnergy = parseInt(DataParts[5]);

			var CurXP = parseInt(DataParts[6]);

			var NeedXP = parseInt(DataParts[7]);

			var Level = parseInt(DataParts[8]);
			
			var Passivo = parseInt(DataParts[9]);

			var Name = DataParts[10];

			if(CurHealth > MaxHealth)

				CurHealth = MaxHealth;

			

			if(CurEnergy > MaxEnergy)

				CurEnergy = MaxEnergy;

			

			if(CurXP > NeedXP)

				CurXP = NeedXP;

	

			var calculatedHP = Math.ceil((((CurHealth / MaxHealth)) ) * 194);

			var calculatedEnergy = Math.ceil((((CurEnergy / MaxEnergy)) ) * 194);

			var calculatedXP = Math.ceil((((CurXP / NeedXP)) ) * 40);

			var calculatedLevel = Math.ceil(((Level + 1)));

			

			var figure = "https://www.habbo.con/habbo-imaging/avatarimage?figure=" + UsersFigure + "&headonly=1";

			var figureto = "https://www.habbo.con/habbo-imaging/avatarimage?figure=" + UsersFigure + "&headonly=1&head_direction=4";



			

			if(UserID == user.id)

			{

				// THATS ME

				

				$('.1').find('.c-nick').text(Name);

				// Health bar SETTER

				var HealthBar = $('.1').find('.vida');

				var HealthValue = HealthBar.css('width');

				

				// Energy Bar SETTER

				var EnergyBar = $('.1').find('.energia');

				var EnergyValue = EnergyBar.css('width');

				

				// XP Bar SETTER

				var XPBar = $('.1').find('.XPBar');

				var XPValue = XPBar.css('height');

				

				// Character Figure

				var CharacterDiv = $('.1').find('.visual');

				var CharacterValue = CharacterDiv.css('background');

				var NewCharacterValue = null;

				

				if(NewCharacterValue == null)

				{

					CharacterDiv.css({background: 'url(' + figure + '), url(https://i.imgur.com/ngcYACE.png) 0'});

					NewCharacterValue = figure;

				}

				

				if(NewCharacterValue != figure)

				{

					$('.1').hide();

					CharacterDiv.css({background: 'url(' + figure + ')'});

					NewCharacterValue = figure;

				}

				if(Passivo == 1)
				{
					$('.passive-mode2').show();
				}
				else
				{
					$('.passive-mode2').hide();
				}	

				// Update Health Bar Width

				if((calculatedHP + 'px') != HealthValue)

				HealthBar.stop().animate({queue: false, width: calculatedHP + 'px'});

				

				$('.1').find('.CurHealth').html("" + CurHealth +("/" + MaxHealth));

				

				// Alterar status limite/atual

				$('.1').show();

				

				// Update Energy Bar Width

				if((calculatedEnergy + 'px') != EnergyValue)

				EnergyBar.stop().animate({queue: false, width: calculatedEnergy + 'px'});

				

				$('.1').find('.CurEnergy').html("" + CurEnergy +("/" + MaxEnergy));

				

				// Alterar status limite/atual

				$('.1').show();

			

				// Update XP Bar Width

				if((calculatedXP + 'px') != XPValue)

				XPBar.stop().animate({queue: false, height: calculatedXP + 'px'});

			     $('.1').find('.proxnivel').text(calculatedLevel);

			

				$('.1').find('.nivel-cclient').html("" + Level);

				

				// Fade in stats bar if not present

				$('.1').show();

			}

			else

			{

				// OUTRO JOGADOR



				$('.2').find('.c-nick').text(Name);
			


				// BARRA DE VIDA

				var HealthBar = $('.2').find('.vida');

				var HealthValue = HealthBar.css('width');

				

				// BARRA DE ENERGIA

				var EnergyBar = $('.2').find('.energia');

				var EnergyValue = EnergyBar.css('width');

				

				// BARRA DE XP

				var XPBar = $('.2').find('.XPBar');

				var XPValue = XPBar.css('height');

				

				// FOCO

			    var	target = UserID;

				

				var CharacterDiv = $('.2').find('.Character');

				var CharacterValue = CharacterDiv.css('background');

				

				

				if(jQuery.trim(CharacterValue.toLowerCase()).indexOf(figureto) <= -1)

				{

					$('.2').fadeIn(200,function(){

				    	CharacterDiv.css({background: 'url(' + figureto + '), url(https://i.imgur.com/ngcYACE.png) 0'});

						NewCharacterValue = figureto;

					});

				}

				if(Passivo == 1)
				{
					$('.passivse-mode2').show();
				}
				else
				{
					$('.passivse-mode2').hide();
				}	

				

				// Update Health Bar Width

				if((calculatedHP + 'px') != HealthValue)

				HealthBar.stop().animate({queue: false, width: calculatedHP + 'px'});

				

				$('.2').find('.CurHealth').html("" + CurHealth +("/" + MaxHealth));

				

				// Alterar status limite/atual

				$('.2').fadeIn();

				

				$('#menick').html(user.name);

				// Update Energy Bar Width

				if((calculatedEnergy + 'px') != EnergyValue)

				EnergyBar.stop().animate({queue: false, width: calculatedEnergy + 'px'});

				

				$('.2').find('.CurEnergy').html("" + CurEnergy +("/" + MaxEnergy));

				

				// Alterar status limite/atual

				$('.2').fadeIn();

			

				// Update XP Bar Width

				if((calculatedXP + 'px') != XPValue)

				XPBar.stop().animate({queue: false, width: calculatedXP + 'px'});

			

			

				$('.2').find('.nivel-cclient').html("" + Level);

				

				// Fade in stats bar if not present

				$('.2').fadeIn();

			}

		}

		else

		{

			$('.2').hide();

		}

	},

	 

};