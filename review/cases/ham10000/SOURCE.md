# Image source

42 dermoscopy images (6 per diagnosis, 7 diagnoses) and the labels file, downloaded on 14 Nov 2026 from Kaggle:
`farjanakabirsamanta/skin-cancer-dataset` ("Skin Cancer Dataset", 2.8 GB in full).

The files are the **HAM10000** dataset: Tschandl P., Rosendahl C., Kittler H., "The HAM10000 dataset, a large collection of multi-source dermatoscopic images of common pigmented skin lesions", Scientific Data 5, 180161 (2018).

- `HAM10000_metadata.csv`: labels for all 10,015 images (diagnosis, how it was confirmed, age, sex, body site).
- `sample.json`: the 42 rows for the images in this folder.

## Licence: check before showing publicly
Kaggle lists the licence as "Other (specified in description)". HAM10000 itself is published under CC BY-NC 4.0 as far as we know: attribution required, **non-commercial use only**. This has not been verified against the Kaggle page. Confirm it before a public demo, and do not use these images in a commercial product.

## How they are used here
Five images appear in the demo queue (`review/cases.js`). Area, age band and the confirmed label come from the dataset. The patient descriptions and the signal analysis are written by us and are not part of the dataset.
