import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from DAO.models.Visualisation_Function.find_triples_total import search_triples_total

class FullGraphService:
    def __init__(self):
        self.new_yt_data_path = './data/new_YT.json'
        self.entities_info_path = './data/entities_info.json'

    def search_total_triplets(self):
        triples = search_triples_total()
        return triples