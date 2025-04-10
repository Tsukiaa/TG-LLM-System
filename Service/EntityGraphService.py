import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from DAO.models.Visualisation_Function.find_triples_by_entity import search_triples_entity



class EntityGraphService:
    def __init__(self):
        self.new_yt_data_path = './data/new_YT.json'
        self.entities_info_path = './data/entities_info.json'

    def search_triplets(self, entity: str):
        triples = search_triples_entity(entity)
        return triples


