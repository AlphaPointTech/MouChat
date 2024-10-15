'use client'
import Chart from "@/Components/Chart";
import LineChartComponent from "@/Components/LineChart";
import { BASE_URL, gpt_url } from "@/Constant/api_variables";
import Image from "next/image";
import { useEffect, useState } from "react";
import LineGoogleChart from "@/Components/LineGoogleChart"
import PieGoogleChart from "@/Components/PieGoogleChart"
import BarGoogleChart from "@/Components/BarGoogleChart"
import TaskCard from "@/Components/TaskCard";



const CATEGORIES = [
  "Prevalence rates",
  "Progression Rates",
  "Treatment Efficacy",
  "Risk Factor Analysis",
  "Impact of Educational Programmemes for the public",
  "Service Delivery Metrics",
  "Patient Outcomes",
  "Market Analysis",
  "Legislative and Policy Impact",
  "Predictive Modeling",
  "Philanthropic Funding Tracking",
  "Technologies",
  "Products",
  "Companies",
  "Training Programmes",
  "Regulations",
  "Clinical Trials",
  "Publications",
  "Non-Profits Involved",
  "Academic Institutions",
]


export default function Home() {
  const [filters, setFilters ] = useState({condition : 'myopia', category : 'Prevalence rates', country_name : null})
  const [response, setResponse] = useState({})

  const fetchData = async () => {
    setResponse({loading : true})
    const response = await fetch(`${BASE_URL}${gpt_url}?category=${filters?.category}&condition=${filters?.condition}&country_name=${filters?.country_name}&query='${filters?.condition} ${filters?.category} in ${filters?.country_name} and related data and latest news'`, {})
    const result = await response.json()
    setResponse(result)
  }
  // console.log(response?.response?.additional_data)
  console.log(response?.semantic_data)

  useEffect(() => {
    if (filters?.country_name){
      fetchData()
    }
  }, [filters])
  return (
    <div>
      <div className="flex gap-2 max-w-[1440px] mx-auto px-[20px]">
        <div className="min-w-[200px] max-w-[300px]">
          <div className="mb-3">
            <h3 class="mb-4 font-semibold text-gray-900 dark:text-white">Condition</h3>
            <ul class="w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <li class="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                    <div class="flex items-center ps-3">
                        <input checked={filters?.condition === 'myopia'} onChange={() => setFilters({...filters, condition : 'myopia'})} id="myopia" type="radio" value="myopia" name="condition" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                        <label for="myopia" class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Myopia </label>
                    </div>
                </li>
                <li class="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                    <div class="flex items-center ps-3">
                        <input checked={filters?.condition === 'comming_soon'} onChange={() => setFilters({...filters, condition : 'comming_soon'})} id="comming_soon" type="radio" value="comming_soon" name="myopia" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                        <label for="comming_soon" class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Comming Soon</label>
                    </div>
                </li>
            </ul>
          </div>
          <div>
            <h3 class="mb-4 font-semibold text-gray-900 dark:text-white">Categories</h3>
            <ul class="w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              {
                CATEGORIES?.map((item, index) => {
                  return (
                    <li class="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                      <div class="flex items-center ps-3">
                          <input checked={filters?.category == item} onChange={() => setFilters({...filters, category : item})} id={`cat-${index}`} type="radio" value={item} name="category" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                          <label for={`cat-${index}`} class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{item}</label>
                      </div>
                    </li>
                  )
                })
              }
                
            </ul>
          </div>
        </div>
        <div className="flex-1 ">
          {
            filters?.country_name && 
            <h3 class="mb-4 font-semibold text-[23px] text-gray-900 dark:text-white">{filters?.country_name}</h3>
          }
          <div className="border-b rounded-2xl overflow-hidden">
            <Chart 
              onSelectCountry={(country_name)=>{
                console.log(country_name)
                setFilters({...filters, country_name})
              }}
            />
          </div>
          <div className="grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-[15px] mt-[16px] ">
            <TaskCard
              bgColor={'white'}
              title={'Audience'}
              value={0}
              badge={{
                className : 'border-[#7b79cf] bg-[#7b79cf50] text-[#7a5ffc]',
                label : 'New',
              }}
            />
            <TaskCard
              bgColor={'white'}
              title={'Visitors'}
              value={0}
            />
            <TaskCard
              bgColor={'white'}
              title={'Conversation'}
              value={0}
            />
            <TaskCard
              bgColor={'white'}
              title={'Total Rate'}
              value={0}
              badge={{
                className : 'border-red-600 bg-red-100 text-red-600',
                label : 'Beta',
              }}
            />
          </div>
          {
            response?.loading &&
            <div className="mt-5">
              <img src={'Images/loader1.gif'} className="w-[70px] mx-auto" />
            </div>
          }
          <div className="mt-5 !p-0 gpt-response">
            
            {
              response?.response?.additional_data && 
              <div className="mb-5">
                <div className="bg-white rounded-2xl border overflow-hidden mb-4">
                  <LineGoogleChart
                    data={response?.response?.additional_data?.map((d) => ({label : d.city, value : d.related_value || d.incidence_rate}))}
                    name={response?.response?.additional_data?.[0]?.related_title ? response?.response?.additional_data?.[0]?.related_title : 'Incidence Rate'}
                  />
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-1 max-w-[600px] bg-white rounded-2xl border overflow-hidden p-10">
                      <PieGoogleChart
                        data={response?.response?.additional_data?.map((d) => ({label : d.city, value : d.related_value || d.incidence_rate}))}
                        name={response?.response?.additional_data?.[0]?.related_title ? response?.response?.additional_data?.[0]?.related_title : 'Incidence Rate'}
                        />
                  </div>
                  <div className="flex-1 bg-white rounded-2xl border overflow-hidden p-10">
                      <BarGoogleChart
                        data={
                          response?.response?.additional_data?.map((d) => ({label : d.city, values : [d.population_before.population_count, d.population_after.population_count]}))
                        }
                        names={[
                          `${response?.response?.additional_data[0]?.population_before.year} Population Count`,
                          `${response?.response?.additional_data[0]?.population_after.year} Population Projection Count`,
                        ]}
                        />
                  </div>
                </div>

                {/* <div className="line-chart">
                  <LineChartComponent
                    data={response?.response?.additional_data?.map((d) => ({label : d.city, value : d.related_value || d.incidence_rate}))}
                    name={response?.response?.additional_data?.[0]?.related_title ? response?.response?.additional_data?.[0]?.related_title : 'Incidence Rate'}
                  />
                </div> */}
              </div>
            }
            {
              response?.response &&
              <div className="pl-4" dangerouslySetInnerHTML={{ __html: response?.response?.content ? response?.response?.content : response?.response }} />
            }

            {

              response?.semantic_data &&
              <div className="flex-1 bg-white rounded-2xl border overflow-hidden p-10">
                <h2>
                  Published Papers :
                </h2>
                {response?.semantic_data?.data?.map((paper) => (
                  <div key={paper.paperId} className="paper-card" style={{ marginTop: "20px"}}>
                    {/* Title with hyperlink */}
                    <h2>
                      <a href={paper.url} target="_blank" rel="noopener noreferrer">
                        {paper.title}
                      </a>
                    </h2>
          
                    {/* Abstract */}
                    <p><strong>Abstract:</strong> {paper.abstract}</p>
          
                    {/* Authors */}
                    <div>
                      <strong>Authors:</strong>
                      <ol style={{ paddingLeft: "20px", listStyleType: "disc" }}>
                        {paper.authors.map((author) => (
                          <li key={author.authorId} style={{ marginBottom: "10px" }}>
                            {author.name}
                          </li>
                        ))}
                      </ol>
                    </div>
                    {/* Refernces */}
                    <div>
                      <strong>References:</strong>
                      <ol style={{ paddingLeft: "20px", listStyleType: "disc" }}> {/* Add padding to indent the list */}
                        {paper.references.map((reference) => (
                          <li key={reference.paperId} style={{ marginBottom: "10px" }}> 
                            {reference.title}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                ))}
            </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
}
