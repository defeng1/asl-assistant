#!/usr/bin/env python
# coding: utf-8


from keras.preprocessing import image
from keras.applications.vgg16 import VGG16 
from tensorflow.keras.applications.resnet50 import ResNet50
from tensorflow.keras.applications.mobilenet import MobileNet
from keras.applications.vgg16 import preprocess_input
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
from sklearn import mixture
import io, os, sys, types, shutil, glob, os.path
from pathlib import Path
import numpy as np
import pickle
import random
import math


# In[120]:


image.LOAD_TRUNCATED_IMAGES = True 
model = VGG16(weights='imagenet', include_top=False)
res_model = ResNet50(weights='imagenet', include_top=False)
mobile_model = MobileNet(weights='imagenet', include_top=False)


# In[146]:


def run_kmeans(images):
    cwd = os.getcwd() 

    feature_list = []
    #pict_dict = dict(zip(pict_list, range(0, len(pict_list))))
    #print(pict_dict)
    pict_list = images
    random.shuffle(pict_list)
    #image.smart_resize(
    #    pict_list, (224, 224), interpolation='bilinear')
    
    for i, imagepath in enumerate(pict_list):
        print("    Status: %s / %s" %(i, len(pict_list)), end="\r")
        im = imagepath.resize((224, 224))
        img_data = image.img_to_array(im)
        img_data = np.expand_dims(img_data, axis=0)
        #img_data = preprocess_input(img_data)
        features = np.array(mobile_model.predict(img_data))
        feature_list.append(features.flatten())


    sil = []
    kmax = 6
    x = np.array(feature_list)

    for k in range(2, kmax+1):
        km = KMeans(n_clusters = k).fit(x)
        labels = km.labels_
        sil.append(silhouette_score(x, labels, metric = 'euclidean'))

    scores = [abs(sil[i] - sil[i-1]) for i in range(1, len(sil))]
    k = scores.index(min(scores)) + 2

    km = KMeans(n_clusters = k).fit(x)
    dists = np.array(km.transform(x)).T
    ind = [i.argmin() for i in dists]

    final = [pict_list[i] for i in ind]
    print(final)
    return final

