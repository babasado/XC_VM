/**
 * Web browser.
 */
(function () {
	if (typeof stbWindowMgr == "undefined") {
		return;
	}

	module.internet = {
		win_inited: false,
	};

	if (stbWindowMgr.InitWebWindow) {
		stbWindowMgr.InitWebWindow(
			"/home/web/public/app/bookmarks/header.html",
			"/home/web/public/app/bookmarks/footer.html"
		);
	}

	main_menu.add(
		get_word("internet"),
		[],
		"mm_ico_internet.png",
		function () {
			stb.EnableVKButton(true);

			_debug("module.internet.win_inited", module.internet.win_inited);

			_debug("stbWindowMgr.IsWebWindowExist", !!stbWindowMgr.IsWebWindowExist);

			_debug("stbWindowMgr.openWebFace", !!stbWindowMgr.openWebFace);

			if (stbWindowMgr.openWebFace) {
				if (gSTB.GetSystemPaths) {
					var system_paths = gSTB.GetSystemPaths();
					_debug("system_paths", system_paths);

					try {
						system_paths = JSON.parse(system_paths);
					} catch (e) {
						_debug(e);
					}

					if (system_paths && system_paths.result && system_paths.result.root) {
						var path = system_paths.result.root;
					}
				} else {
					path = "/home/web/";
				}

				path = path[path.length - 1] != "/" ? path + "/" : path;
				_debug("path", path);
				stbWindowMgr.openWebFace(
					path +
						"public/app/ibman/index.html?mode=2&url=" +
						encodeURIComponent("http://google.com") +
						"&view=1"
				);
				module.internet.win_inited = true;
			} else if (
				module.internet.win_inited &&
				stbWindowMgr.IsWebWindowExist &&
				stbWindowMgr.IsWebWindowExist()
			) {
				stbWindowMgr.raiseWebWindow();
			} else {
				if (stbWindowMgr.InitWebWindow) {
					stbWindowMgr.LoadUrl("http://google.com");
					stbWindowMgr.raiseWebWindow();
				} else {
					stbWindowMgr.openWebWindow("http://google.com");
				}

				module.internet.win_inited = true;
			}
		},
		{ layer_name: "internet" }
	);
})();

// Experimental YouTube TV launcher. Keep authentication in the portal unchanged.
(function () {
    var target = "https://www.youtube.com/tv";
    var notice = new ModalForm({
        title: "YouTube TV (Test)",
        text: "Open YouTube in the box browser. Playback depends on your firmware. " +
            "Use the browser Back/Exit key to return; if needed, reopen your portal."
    });
    notice.enableOnExitClose();
    notice.addItem(new ModalFormButton({
        value: get_word("cancel_btn"),
        onclick: function () { notice.hide(); }
    }));
    notice.addItem(new ModalFormButton({
        value: "YouTube TV",
        onclick: function () {
            notice.hide();
            try {
                if (stb.player && stb.player.on) {
                    stb.player.stop();
                }
                if (typeof stbWindowMgr != "undefined" && stbWindowMgr.openWebWindow) {
                    stbWindowMgr.openWebWindow(target);
                } else if (typeof stbWindowMgr != "undefined" &&
                    stbWindowMgr.LoadUrl && stbWindowMgr.raiseWebWindow) {
                    if (stbWindowMgr.InitWebWindow) {
                        stbWindowMgr.InitWebWindow(
                            "/home/web/public/app/bookmarks/header.html",
                            "/home/web/public/app/bookmarks/footer.html"
                        );
                    }
                    stbWindowMgr.LoadUrl(target);
                    stbWindowMgr.raiseWebWindow();
                } else {
                    window.location.href = target;
                }
            } catch (e) {
                _debug("YouTube TV launch failed", e);
                var failure = new ModalForm({
                    title: "YouTube TV",
                    text: "The box browser could not open YouTube."
                });
                failure.enableOnExitClose();
                failure.addItem(new ModalFormButton({
                    value: "OK",
                    onclick: function () { failure.hide(); }
                }));
                failure.show();
            }
        }
    }));
    main_menu.add("YouTube TV (Test)", [], "mm_ico_internet.png", function () {
        notice.show();
    }, { layer_name: "youtube_tv" });
})();

loader.next();
