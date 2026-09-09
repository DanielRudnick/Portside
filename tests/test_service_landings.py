from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

PAGES = {
    "House Cleaning": ROOT / "house-cleaning-services-atlanta-ga.html",
    "Deep Cleaning": ROOT / "deep-cleaning-services-atlanta-ga.html",
    "Move-In / Move-Out Cleaning": ROOT / "move-in-move-out-cleaning-atlanta-ga.html",
}

NAV_TARGETS = [
    "/house-cleaning-services-atlanta-ga",
    "/deep-cleaning-services-atlanta-ga",
    "/move-in-move-out-cleaning-atlanta-ga",
]

CANONICALS = {
    "House Cleaning": "https://www.portsideclean.com/house-cleaning-services-atlanta-ga",
    "Deep Cleaning": "https://www.portsideclean.com/deep-cleaning-services-atlanta-ga",
    "Move-In / Move-Out Cleaning": "https://www.portsideclean.com/move-in-move-out-cleaning-atlanta-ga",
}


def read(path: Path) -> str:
    assert path.exists(), f"Missing expected landing page: {path.name}"
    return path.read_text(encoding="utf-8")


def test_pages_exist_and_share_conversion_contract():
    for service, path in PAGES.items():
        html = read(path)
        assert "$115" in html, f"{service}: minimum price must be $115"
        assert 'href="#estimate"' in html, f"{service}: CTA must scroll to estimate form"
        assert 'id="estimate"' in html, f"{service}: estimate section missing"
        for field in ["f-name", "f-phone", "f-email", "f-address", "f-zipcode", "f-info"]:
            assert f'id="{field}"' in html, f"{service}: missing form field {field}"
        assert "new-backend.botconversa.com.br/api/v1/webhooks-automation/catch/100434/2zKCNWt5Eklt/" in html
        assert "+14046410139" in html
        assert "portsidecleanusa@gmail.com" in html
        assert "AW-18244942689/oqQUCM-6mOkcEOH27vtD" in html
        assert "USD" in html
        for target in NAV_TARGETS:
            assert target in html, f"{service}: nav is missing {target}"


def test_each_page_has_unique_search_intent():
    for service, path in PAGES.items():
        html = read(path)
        assert CANONICALS[service] in html, f"{service}: canonical URL is wrong"
        assert service.lower().split(" /")[0] in html.lower(), f"{service}: service intent missing from page"


def test_root_is_new_house_cleaning_entry():
    html = read(ROOT / "index.html")
    assert "/house-cleaning-services-atlanta-ga" in html
    assert "House Cleaning" in html
    assert "$115" in html
    assert 'href="#estimate"' in html


def test_sitemap_lists_new_campaign_urls_only():
    xml = read(ROOT / "sitemap.xml")
    for canonical in CANONICALS.values():
        assert canonical in xml
    assert "airbnb-cleaning-atlanta" not in xml


if __name__ == "__main__":
    tests = [
        test_pages_exist_and_share_conversion_contract,
        test_each_page_has_unique_search_intent,
        test_root_is_new_house_cleaning_entry,
        test_sitemap_lists_new_campaign_urls_only,
    ]
    for test in tests:
        test()
        print(f"PASS: {test.__name__}")
    print("ALL TESTS PASSED")
